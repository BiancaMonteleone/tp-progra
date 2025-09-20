import { CanActivateFn } from '@angular/router';
import { Supabase } from '../services/supabase';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = async () => {
  const supabase = inject(Supabase);
  const router = inject(Router);

  const session = await supabase.getSession();

  if (session) {
    return true;
  } else {
    return router.createUrlTree(['/home']);
  }
};
