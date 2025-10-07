import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordService } from '../../services/word.service';
import { Ducky } from '../../components/ducky/ducky';
import { Supabase } from '../../services/supabase';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-hangman',
  imports: [CommonModule, Ducky, Loading],
  templateUrl: './hangman.html',
  styleUrl: './hangman.css',
})
export class Hangman implements OnInit {
  // Variables del juego
  modalMessage: string = '';
  isModalOpen: boolean = false;
  gallowSrc: string = '/img/gallow/gallow_0.png';
  
  // Estado del juego
  selectedWord: string = '';
  correctLetters: number = 0;
  displayWord: string[] = [];
  wrongLetters: string[] = [];
  errors: number = 6;
  letters: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  letterStates: { [key: string]: 'correct' | 'incorrect' | '' } = {};
  elapsedTime: number = 0;
  timerInterval: any;
  
  // Animaciones de Ducky
  duckyAnimation = 'climb';
  duckyMovement = 'enterHangman';
  isCorrect = false;
  isFailed = false;
  
  session: any = null;
  loading: boolean = true;
  constructor(
    private cdr: ChangeDetectorRef,
    private wordService: WordService,
    private supabase: Supabase,
    private router: Router
  ) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();
    this.startTimer();
    this.loading = false;
    this.cdr.detectChanges();
    this.initGame();

    // Animación inicial del pato
    setTimeout(() => {
      this.duckyAnimation = 'walkRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 1130);
    }, 1450);
  }

  // Temporizador
  startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
      this.cdr.detectChanges();
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Configuración inicial del juego
  initGame(): void {
    this.wordService.getRandomWord().subscribe({
      next: (words) => {
        this.selectedWord = words[0].toUpperCase();
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

  // Normalización de palabras
  normalizeWord(word: string): string {
    return word
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('ñ', 'ñ');
  }

  // Lógica de adivinanza
  guessLetter(letter: string): void {
    if (this.displayWord.includes(letter) || this.wrongLetters.includes(letter)) return;

    if (this.selectedWord.includes(letter)) {
      this.letterStates[letter] = 'correct';
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();

      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 500);

      for (let i = 0; i < this.selectedWord.length; i++) {
        if (this.selectedWord[i] === letter) {
          this.displayWord[i] = letter;
          this.correctLetters++;
        }
      }
    } else {
      this.letterStates[letter] = 'incorrect';
      this.wrongLetters.push(letter);
      this.errors--;
      this.gallowSrc = `/img/gallow/gallow_${6 - this.errors}.png`;

      if (this.errors > 0) {
        this.duckyAnimation = 'hideRight';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.duckyAnimation = 'sittingRight';
          this.cdr.detectChanges();
        }, 500);
      }
    }

    this.checkGameOver();
  }

  // Verificación de fin de juego
  async checkGameOver() {
    if (!this.displayWord.includes('_')) {
      // Ganó
      this.stopTimer();
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();

      Swal.fire({
        title: '¡Muy bien! 🎉',
        text: `La palabra era: ${this.selectedWord}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Salir',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.continueGame();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.supabase.registerScore(
            this.session.user.email,
            this.correctLetters,
            this.elapsedTime,
            'hangman'
          );
          this.router.navigate(['/home']);
        }
      });
    } else if (this.errors <= 0) {
      // Perdió
      this.stopTimer();
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();

      await this.supabase.registerScore(
        this.session.user.email,
        this.correctLetters,
        this.elapsedTime,
        'hangman'
      );

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
          this.gameOver();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  // Reiniciar juego
  gameOver() {
    this.isModalOpen = false;
    this.loading = true;
    this.cdr.detectChanges();

    this.correctLetters = 0;
    this.duckyAnimation = 'sittingRight';
    this.errors = 6;
    this.gallowSrc = '/img/gallow/gallow_0.png';
    this.letterStates = {};
    this.elapsedTime = 0;

    this.startTimer();
    this.loading = false;
    this.initGame();
    this.cdr.detectChanges();
  }

  // Continuar con nueva palabra
  continueGame(): void {
    this.isModalOpen = false;
    this.duckyAnimation = 'sittingRight';
    this.errors = 6;
    this.gallowSrc = '/img/gallow/gallow_0.png';
    this.letterStates = {};
    this.startTimer();
    this.initGame();
    this.cdr.detectChanges();
  }

  // Deshabilitar letras ya usadas
  isLetterDisabled(letter: string): boolean {
    return this.displayWord.includes(letter) || this.wrongLetters.includes(letter);
  }
}
