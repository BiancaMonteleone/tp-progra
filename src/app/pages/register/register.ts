import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../../components/ducky/ducky';
import { Router } from '@angular/router';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, Ducky, Loading],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  // Datos del formulario
  name = '';
  lastName = '';
  age = '';
  email = '';
  password = '';
  confirmPassword = '';
  errors: { [key: string]: string } = {};

  // Animaciones de Ducky
  duckyAnimation = 'jump';
  duckyMovement = 'enterRegister';

  loading = true;

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loading = false;
    this.cdr.detectChanges();

    // Animación inicial del pato
    setTimeout(() => {
      this.duckyAnimation = 'climb';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingLeft';
        this.cdr.detectChanges();
      }, 1700);
    }, 1000);
  }

  // Envío del formulario
  async onSubmit() {
    this.errors = {};

    // Validaciones
    if (!this.name.trim()) this.errors['name'] = 'Ingrese su nombre';
    if (!this.lastName.trim()) this.errors['lastName'] = 'Ingrese su apellido';
    if (!this.age) this.errors['age'] = 'Ingrese su edad';
    if (!this.email.trim()) this.errors['email'] = 'Ingrese su mail';
    if (!this.password.trim()) this.errors['password'] = 'Ingrese su contraseña';
    if (!this.confirmPassword.trim()) this.errors['confirmPassword'] = 'Confirme su contraseña';
    if (
      this.password.trim() &&
      this.confirmPassword.trim() &&
      this.password.trim() !== this.confirmPassword.trim()
    ) {
      this.errors['confirmPassword'] = 'Las contraseñas no coinciden';
    }

    // Si hay errores, no continuar
    if (Object.keys(this.errors).length > 0) return;

    console.log('Formulario válido');

    // Registro en Supabase
    try {
      await this.supabase.register(
        this.email,
        this.password,
        this.name,
        this.lastName,
        Number(this.age)
      );
      console.log('Registro exitoso');
      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
    }
  }
}
