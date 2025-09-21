import { Component, ChangeDetectorRef } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {}

  logOut() {
    this.supabase.logout();
    this.cdr.detectChanges();
  }

  redirect(game: string) {
    console.log('hola');
    
    this.router.navigate([`/${game}`]);
  }
}
