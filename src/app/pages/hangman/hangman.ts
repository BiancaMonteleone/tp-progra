import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../components/modal/modal';
import { WordService } from '../../services/word.service';
import { Ducky } from '../../components/ducky/ducky';
import { Supabase } from '../../services/supabase';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hangman',
  imports: [CommonModule, Modal, Ducky],
  templateUrl: './hangman.html',
  styleUrl: './hangman.css',
})
export class Hangman implements OnInit {
  modalMessage: string = '';
  isModalOpen: boolean = false;
  duckyAnimation = 'floatingRight';
  duckyMovement = 'enterHangman';
  user: any = null;

  selectedWord: string = '';
  displayWord: string[] = [];
  wrongLetters: string[] = [];
  errors: number = 6;
  letters: string[] = 'abcdefghijklmnñopqrstuvwxyz'.split('');

  constructor(
    private cdr: ChangeDetectorRef,
    private wordService: WordService,
    private supabase: Supabase,
    private router: Router
  ) {}

  async ngOnInit() {
    this.user = await this.supabase.getUser();
    this.initGame();
    setTimeout(() => {
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 600);
    }, 1450);
  }

  initGame(): void {
    this.wordService.getRandomWord().subscribe({
      next: (words) => {
        this.selectedWord = words[0].toLowerCase();
        console.log(this.selectedWord);

        this.displayWord = Array(this.selectedWord.length).fill('_');
        this.wrongLetters = [];
        this.errors = 6;
        this.selectedWord = this.normalizeWord(this.selectedWord);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener palabra:', err);
      },
    });
  }

  normalizeWord(word: string): string {
    return word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('ñ', 'ñ');
  }

  guessLetter(letter: string): void {
    if (this.displayWord.includes(letter) || this.wrongLetters.includes(letter)) return;

    if (this.selectedWord.includes(letter)) {
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 700);
      for (let i = 0; i < this.selectedWord.length; i++) {
        if (this.selectedWord[i] === letter) this.displayWord[i] = letter;
      }
    } else {
      this.duckyAnimation = 'hideRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 700);
      this.wrongLetters.push(letter);
      this.errors--;
    }

    this.checkGameOver();
    this.cdr.detectChanges();
  }

  checkGameOver(): void {
    if (!this.displayWord.includes('_')) {
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();
      this.supabase.registerScore(this.user.auth_id, this.selectedWord.length, 'hangman_scores');
      Swal.fire({
        title: '¡Ganaste! 🎉',
        text: `La palabra era: ${this.selectedWord}`,
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
    } else if (this.errors <= 0) {
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();
      Swal.fire({
        title: 'Perdiste 😢',
        text: `La palabra era: ${this.selectedWord}`,
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

  restartGame(): void {
    this.isModalOpen = false;
    this.duckyAnimation = 'sittingRight';
    this.initGame();
    this.cdr.detectChanges();
  }

  isLetterDisabled(letter: string): boolean {
    return this.displayWord.includes(letter) || this.wrongLetters.includes(letter);
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
