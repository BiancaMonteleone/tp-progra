import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-hangman',
  imports: [CommonModule, Modal],
  templateUrl: './hangman.html',
  styleUrl: './hangman.css',
})
export class Hangman implements OnInit {
  modalMessage: string = '';
  isModalOpen: boolean = false;
  words: string[] = ['typescript', 'html', 'javascript', 'bootstrap'];
  selectedWord: string = '';
  displayWord: string[] = [];
  wrongLetters: string[] = [];
  remainingAttempts: number = 6;

  letters: string[] = 'abcdefghijklmnñopqrstuvwxyz'.split('');

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initGame();
  }

  initGame(): void {
    this.selectedWord = this.words[Math.floor(Math.random() * this.words.length)];
    this.displayWord = Array(this.selectedWord.length).fill('_');
    this.wrongLetters = [];
    this.remainingAttempts = 6;
    this.cdr.detectChanges();
  }

  guessLetter(letter: string): void {
    if (this.displayWord.includes(letter) || this.wrongLetters.includes(letter)) return;

    if (this.selectedWord.includes(letter)) {
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
      this.showModal('¡Ganaste! 🎉');
      setTimeout(() => this.restartGame(), 2000);
    } else if (this.remainingAttempts <= 0) {
      this.showModal(`Perdiste 😢 La palabra era: ${this.selectedWord}`);
      setTimeout(() => this.restartGame(), 2000);
    }
  }

  isLetterDisabled(letter: string): boolean {
    return this.displayWord.includes(letter) || this.wrongLetters.includes(letter);
  }

  restartGame(): void {
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
