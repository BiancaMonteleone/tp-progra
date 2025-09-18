import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../ducky/ducky';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, Ducky],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{
  name = '';
  lastName = '';
  age = ''
  email = '';
  password = '';
  confirmPassword = '';
  errors: { [key: string]: string } = {};
  duckyAnimation = 'climb';
  duckyMovement = 'enterRegister';

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.duckyAnimation = 'sittingLeft'
      this.cdr.detectChanges();
    }, 2000)
  }

  async onSubmit() {
    this.errors = {};

    if (!this.name.trim()) {
      this.errors['name'] = 'Ingrese su nombre';
    }
    if (!this.lastName.trim()) {
      this.errors['lastName'] = 'Ingrese su apellido';
    }
    if (!this.age) {
      this.errors['age'] = 'Ingrese su edad';
    }
    if (!this.email.trim()) {
      this.errors['email'] = 'Ingrese su mail';
    }
    if (!this.password.trim()) {
      this.errors['password'] = 'Ingrese su contraseña';
    }
    if (!this.confirmPassword.trim()) {
      this.errors['confirmPassword'] = 'Confirme su contraseña';
    }
    if (
      this.password.trim() &&
      this.confirmPassword.trim() &&
      this.password.trim() !== this.confirmPassword.trim()
    ) {
      this.errors['confirmPassword'] = 'Las contraseñas no coinciden';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }
    console.log('Formulario válido');
    try {
      await this.supabase.register(this.email, this.password, this.name, this.lastName, Number(this.age));
      console.log('Registro exitoso');
    } catch (error) {
      console.log(error);
    }
  }
}