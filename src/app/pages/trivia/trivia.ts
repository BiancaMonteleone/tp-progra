import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ducky } from '../../components/ducky/ducky';
import { Loading } from '../../components/loading/loading';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trivia',
  imports: [CommonModule, Ducky, Loading],
  templateUrl: './trivia.html',
  styleUrl: './trivia.css',
})
export class Trivia implements OnInit {
  duckyAnimation = 'fallRight';
  duckyMovement = 'enterTrivia';
  questions: any[] = [];
  currentQuestion: any = null;
  currentIndex = 0;
  score = 0;
  loading = true;

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    await this.loadQuestions();
    this.startGame();
    this.loading = false;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      setTimeout(() => {
        this.cdr.detectChanges();

        setTimeout(() => {
          this.duckyAnimation = 'sittingRight';
          this.cdr.detectChanges();
        }, 600);
      }, 50);
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();
    }, 800);
    this.cdr.detectChanges();
  }

  async loadQuestions() {
    const res = await fetch('/files/questions.json');
    this.questions = await res.json();
    this.shuffle(this.questions);
  }

  startGame() {
    this.currentIndex = 0;
    this.score = 0;
    this.currentQuestion = this.questions[this.currentIndex];
  }

  selectOption(option: string) {
    const correct = option === this.currentQuestion.answer;

    if (correct) {
      this.score++;
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 500);
      this.nextQuestion();
    } else {
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();
      Swal.fire({
        title: 'Incorrecto 😢',
        text: `La respuesta era "${this.currentQuestion.answer}"`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Jugar de nuevo',
        cancelButtonText: 'Salir',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => this.restartGame());
    }
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex >= this.questions.length) {
      Swal.fire({
        title: '¡Ganaste! 🎉',
        text: `Puntaje final: ${this.score}/${this.questions.length}`,
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
          this.restartGame();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.currentQuestion = this.questions[this.currentIndex];
      this.cdr.detectChanges();
    }
  }

  async restartGame() {
    this.loading = true;
    this.cdr.detectChanges();
    await this.loadQuestions();
    this.duckyAnimation = 'fallRight';
    this.ngOnInit();
    this.cdr.detectChanges();
  }

  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
