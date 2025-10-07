import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Supabase } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ducky } from '../../components/ducky/ducky';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, Ducky, Loading],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  // Variables de sesión y mensajes
  session: any = null;
  newMessage: string = '';
  loading: boolean = true;

  // Animaciones del pato
  duckyAnimation = 'floatingLeft';
  duckyMovement = 'enterChat';

  // Referencia al contenedor de mensajes
  @ViewChild('chatMessages') private chatContainer!: ElementRef;

  constructor(public supabase: Supabase, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();
    await this.supabase.getMessages();
    setTimeout(() => this.scrollToBottom(), 0);

    this.loading = false;
    this.cdr.detectChanges();

    // Animaciones secuenciales del pato
    setTimeout(() => {
      this.duckyAnimation = 'fallLeft';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingLeft';
        this.cdr.detectChanges();
      }, 700);
    }, 1600);
  }

  // Destruir componente
  ngOnDestroy() {
    this.supabase.removeRealtime();
  }

  // Enviar mensaje
  async sendMessage() {
    if (!this.newMessage.trim()) return;
    await this.supabase.sendMessage(this.session.user.email, this.newMessage);
    this.newMessage = '';
  }

  // Después de actualizar la vista, hacer scroll al final
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // Función para hacer scroll al final
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
