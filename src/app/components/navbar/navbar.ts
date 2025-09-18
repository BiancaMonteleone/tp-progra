import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  logged = false;

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.supabase.onAuthStateChange((event, session) => {
      this.logged = session !== null;
      this.cdr.detectChanges();
    });
  }
}
