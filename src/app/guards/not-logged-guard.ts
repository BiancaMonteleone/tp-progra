import { CanActivateFn } from '@angular/router';
import { Supabase } from '../services/supabase';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export const notLoggedGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(Supabase);
  const router = inject(Router);

  const session = await supabase.getSession();

  if (!session) {
    return true;
  } else {
    Swal.fire({
      title: '¿A dónde vas? 🤨',
      text: 'Necesitas cerrar sesión para acceder a esta página',
      icon: 'error',
    }) 
    return router.createUrlTree(['/home']);
  }
};
