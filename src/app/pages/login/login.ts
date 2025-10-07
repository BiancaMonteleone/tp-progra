import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../../components/ducky/ducky';
import { Router } from '@angular/router';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Ducky, Loading],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  /* Formulario de login */
  formLogin: FormGroup;

  /* Animaciones del pato */
  duckyAnimation = 'fallRight';
  duckyMovement = 'enterLogin';

  /* estado de carga */
  loading: boolean = false;

  /* Usuarios de login rápido */
  quickUsers = {
    user1: { email: 'fiore@gmail.com', password: '123456' },
    user2: { email: 'bianca@gmail.com', password: '123456' },
    user3: { email: 'mati@gmail.com', password: '123456' },
  };

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
    this.loading = false;
    this.cdr.detectChanges();

    /* Animación inicial del pato */
    setTimeout(() => {
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();
    }, 700);
  }

  /* Envío del formulario */
  async onSubmit() {
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
        this.cdr.detectChanges();
      }
    } catch (error: any) {
      this.formLogin.get('email')?.setErrors({ userNotFound: true });
    }
  }

  /* Obtener mensaje de error de cada campo */
  getErrorMsj(controlName: string): string {
    const control = this.formLogin.get(controlName);
    if (!control) return '';
    if (control.hasError('required')) return 'Campo obligatorio';
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('minlength'))
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    return '';
  }

  /* Login rápido con usuarios predefinidos */
  async quickLogin(user: 'user1' | 'user2' | 'user3') {
    const credentials = this.quickUsers[user];
    if (!credentials) return;

    this.formLogin.patchValue({
      email: credentials.email,
      password: credentials.password,
    });

    await this.onSubmit();
  }
}
