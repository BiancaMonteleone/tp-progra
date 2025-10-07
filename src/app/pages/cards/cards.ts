import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Modal } from '../../components/modal/modal';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../../components/ducky/ducky';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-cards',
  imports: [Modal, CommonModule, Ducky, Loading],
  templateUrl: './cards.html',
  styleUrls: ['./cards.css'],
})
export class Cards implements OnInit {
  modalMessage: string = '';
  isModalOpen: boolean = false;
  duckyAnimation = 'jumpLeft';
  duckyMovement = 'enterCards';
  user: any = null;
  loading = true;

  deck: any[] = [];
  currentCard: any = null;
  nextCard: any = null;
  score: number = 0;

  constructor(private cdr: ChangeDetectorRef, private supabase: Supabase, private router: Router) {}

  async ngOnInit() {
    this.user = await this.supabase.getUser();
    this.initGame();
    this.loading = false;
    this.cdr.detectChanges();
    this.duckyAnimation = 'roll';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.duckyAnimation = 'crash';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 300);
    }, 1700);
  }

  initGame() {
    this.deck = this.generateDeck();
    this.currentCard = this.deck.shift();
    this.cdr.detectChanges();
  }

  generateDeck(): any[] {
    const suits = ['corazones', 'diamantes', 'treboles', 'picas'];
    const values = ['as', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'reina', 'rey'];

    const deck = [];

    for (const suit of suits) {
      for (const value of values) {
        deck.push({
          suit,
          value,
          image: `img/cards/${value}_de_${suit}.png`,
        });
      }
    }
    return this.shuffle(deck);
  }

  guess(higher: boolean) {
    if (this.deck.length === 1) {
      this.supabase.registerScore(this.user.auth_id, this.score, null, 'cards');
      Swal.fire({
        title: '¡Ganaste! 🎉',
        text: 'Terminaste el mazo',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Jugar de nuevo',
        cancelButtonText: 'Salir',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.restartGame();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigate(['/home']);
        }
      });
      return; // Prevent further execution when deck is empty
    }

    this.nextCard = this.deck[0];
    const currentValue = this.getValue(this.currentCard.value);
    const nextValue = this.getValue(this.nextCard.value);

    const correct =
      (higher && nextValue > currentValue) ||
      (!higher && nextValue < currentValue) ||
      nextValue === currentValue;

    if (correct) {
      this.score++;
      this.currentCard = this.deck.shift();

      this.nextCard = null;
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 700);
    } else {
      this.supabase.registerScore(this.user.auth_id, this.score, null, 'cards');
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();
      Swal.fire({
        title: 'Perdiste 😢',
        text: `La siguiente carta era '${this.nextCard.value} de ${this.nextCard.suit}'`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Jugar de nuevo',
        cancelButtonText: 'Salir',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.restartGame();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  getValue(value: string): number {
    switch (value) {
      case 'as':
        return 1;
      case 'rey':
        return 13;
      case 'reina':
        return 12;
      case 'jack':
        return 11;
      default:
        return Number(value);
    }
  }

  shuffle(deck: any[]): any[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  restartGame(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.isModalOpen = false;
    this.duckyAnimation = 'sittingRight';
    this.score = 0;
    this.nextCard = null;
    this.loading = false;
    this.cdr.detectChanges();
    this.initGame();
    this.cdr.detectChanges();
  }

  showModal(message: string): void {
    this.modalMessage = message;
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }
}
