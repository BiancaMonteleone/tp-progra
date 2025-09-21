import { Component, OnDestroy, OnInit, ViewChild, ElementRef, effect } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  session: any = null;
  newMessage: string = '';
  @ViewChild('chatMessages') private chatContainer!: ElementRef;

  constructor(public supabase: Supabase) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();
    await this.supabase.getMessages();
    setTimeout(() => this.scrollToBottom(), 0);
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;
    await this.supabase.sendMessage(this.session.user.email, this.newMessage);
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.supabase.removeRealtime();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  /*session: any = null;
  newMessage: string = '';
  @ViewChild('chatMessages') private chatContainer!: ElementRef;

  constructor(public supabase: Supabase) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();
    await this.supabase.getMessages();

    effect(() => {
      console.log('Mensajes actualizados', this.supabase.messages());
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;
    await this.supabase.sendMessage(this.session.user.email, this.newMessage);
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.supabase.removeRealtime();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }*/
}
