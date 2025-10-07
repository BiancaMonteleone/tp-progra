import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Loading],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  loading: boolean = true;

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  // Cerrar sesión
  logOut() {
    this.supabase.logout();
    this.cdr.detectChanges();
  }

  // Redirección a juegos
  redirect(game: string) {
    this.router.navigate([`/${game}`]);
  }
}
