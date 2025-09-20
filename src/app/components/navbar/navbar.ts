import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  logged = false;
  user: any = null;

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    try{
      this.user = await this.supabase.getUser();
    }catch(error){
      console.error(error);
    }
    this.supabase.onAuthStateChange((event, session) => {
      this.logged = session !== null;
      this.cdr.detectChanges();
    });
  }

  logOut() {
    try{
      this.supabase.logout();
      this.router.navigate(['/home']);
      this.cdr.detectChanges();
    }catch(error){
      console.error(error);
    }
  }
}
