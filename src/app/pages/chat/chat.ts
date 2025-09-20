import { Component, OnInit } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  session: any = null;
  messages: any = null;

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();
    this.messages = await this.supabase.getMessages();
    console.log(this.messages);
    
  }
}
