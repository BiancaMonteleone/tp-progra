import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../ducky/ducky';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, Ducky],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  user = '';
  errors: { [key: string]: string } = {};
  duckyAnimation = 'fall';
  duckyMovement = 'fallLogin';

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.duckyAnimation = 'death'
      this.cdr.detectChanges();
    }, 750)
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
      const result = await this.supabase.login(this.email, this.password);
      console.log(result.profile);
    } catch (error) {
      console.error(error);
    }
  }
}
