import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../ducky/ducky';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Ducky],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  formLogin: FormGroup;
  duckyAnimation = 'fall';
  duckyMovement = 'enterLogin';
  quickUsers = [
      { email: 'user1@example.com', password: '123456' },
      { email: 'user2@example.com', password: 'abcdef' },
      { email: 'user3@example.com', password: 'qwerty' },
    ];

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.duckyAnimation = 'death';
      this.cdr.detectChanges();
    }, 700);
  }

  async onSubmit() {
    // Marcamos todos los campos como "touched" para que aparezcan los errores
    this.formLogin.markAllAsTouched();

    if (this.formLogin.invalid) {
      return;
    }

    const { email, password } = this.formLogin.value;

    try {
      const { data, error } = await this.supabase.login(email, password);

      if (data?.user) {
        console.log('Usuario logueado:', data.user.email);
        this.router.navigate(['/home']);
        this.cdr.detectChanges()
      }
    } catch (error: any) {
      this.formLogin.get('email')?.setErrors({ userNotFound: true });
    }
  }

  // Método para obtener mensaje de error de un control
  getErrorMsj(controlName: string): string {
    const control = this.formLogin.get(controlName);
    if (!control) return '';
    if (control.hasError('required')) return 'Campo obligatorio';
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('minlength'))
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    return '';
  }
}
