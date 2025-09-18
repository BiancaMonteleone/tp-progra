import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../ducky/ducky';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, Ducky],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  email = '';
  password = '';
  errors: { [key: string]: string } = {};
  duckyAnimation = 'fall';
  duckyMovement = 'fallLogin';

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router,) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.duckyAnimation = 'death'
      this.cdr.detectChanges();
    }, 750)
  }

  logOut(){
    this.supabase.logout();
  }

  async onSubmit() {
    this.errors = {};

    if (!this.email.trim()) {
      this.errors['email'] = 'Ingrese su mail';
    }
    if (!this.password.trim()) {
      this.errors['password'] = 'Ingrese su contraseña';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }
    console.log('Formulario válido');
    try {
      const { user, session } = await this.supabase.login(this.email, this.password);

      if (user) {
        console.log('Usuario logueado:', user.email);
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      console.log(error);
      
    }
  }
}
