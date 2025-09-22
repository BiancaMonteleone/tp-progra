import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../components/modal/modal';
import { WordService } from '../../services/word.service';
import { Ducky } from '../../components/ducky/ducky';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-hangman',
  imports: [CommonModule, Modal, Ducky],
  templateUrl: './hangman.html',
  styleUrl: './hangman.css',
})
export class Hangman implements OnInit {
  modalMessage: string = '';
  isModalOpen: boolean = false;
  user: any = null;
  words: string[] = ['typescript', 'html', 'javascript', 'bootstrap'];
  selectedWord: string = '';
  displayWord: string[] = [];
  wrongLetters: string[] = [];
  remainingAttempts: number = 6;

  letters: string[] = 'abcdefghijklmnñopqrstuvwxyz'.split('');

  duckyAnimation = 'floating';
  duckyMovement = 'enterHangman';

  constructor(private cdr: ChangeDetectorRef, private wordService: WordService, private supabase: Supabase) {}

  async ngOnInit() {
    this.user = await this.supabase.getUser()
    this.initGame();
    setTimeout(() => {
      this.duckyAnimation = 'fall';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 550);
    }, 1450);
  }

  normalizeWord(word: string): string {
    return word
      .toLowerCase()
      .normalize('NFD') // separa letras y acentos
      .replace(/[\u0300-\u036f]/g, ''); // quita tildes
  }

  initGame(): void {
    // Pedir palabra de la API
    this.wordService.getRandomWord().subscribe({
      next: (words) => {
        this.selectedWord = words[0].toLowerCase();
        this.displayWord = Array(this.selectedWord.length).fill('_');
        this.wrongLetters = [];
        this.remainingAttempts = 6;
        this.selectedWord = this.normalizeWord(this.selectedWord);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener palabra:', err);
        // fallback si falla la API
        this.selectedWord = 'angular';
        this.displayWord = Array(this.selectedWord.length).fill('_');
      },
    });
  }

  guessLetter(letter: string): void {
    if (this.displayWord.includes(letter) || this.wrongLetters.includes(letter)) return;

    if (this.selectedWord.includes(letter)) {
      this.duckyAnimation = 'fall';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 700);
      for (let i = 0; i < this.selectedWord.length; i++) {
        if (this.selectedWord[i] === letter) this.displayWord[i] = letter;
      }
    } else {
      this.wrongLetters.push(letter);
      this.remainingAttempts--;
    }

    this.checkGameOver();
    this.cdr.detectChanges();
  }

  checkGameOver(): void {
    if (!this.displayWord.includes('_')) {
      this.duckyAnimation = 'fall';
      this.cdr.detectChanges();
      this.showModal('¡Ganaste! 🎉');
      this.supabase.registerScore(this.user.auth_id, this.selectedWord.length, 'hangman_scores')
      setTimeout(() => this.restartGame(), 2000);
    } else if (this.remainingAttempts <= 0) {
      this.duckyAnimation = 'death';
      this.cdr.detectChanges();
      this.showModal(`Perdiste 😢 La palabra era: ${this.selectedWord}`);
      setTimeout(() => this.restartGame(), 2000);
    }
  }

  isLetterDisabled(letter: string): boolean {
    return this.displayWord.includes(letter) || this.wrongLetters.includes(letter);
  }

  restartGame(): void {
    this.duckyAnimation = 'sittingRight';
    this.cdr.detectChanges();
    this.isModalOpen = false;
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
