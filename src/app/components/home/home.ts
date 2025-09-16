import { Component, ChangeDetectorRef } from '@angular/core';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {}
  logOut(){
    this.supabase.logout();
    this.cdr.detectChanges();
  }
}
