import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ducky } from '../../components/ducky/ducky';
import { Loading } from '../../components/loading/loading';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-trivia',
  imports: [CommonModule, Ducky, Loading],
  templateUrl: './trivia.html',
  styleUrl: './trivia.css',
})
export class Trivia implements OnInit {
  // Juego
  questions: any[] = [];
  currentQuestion: any = null;
  currentIndex = 0;
  score = 0;
  
  // Animaciones de Ducky
  duckyAnimation = 'fallRight';
  duckyMovement = 'enterTrivia';
  
  loading = true;
  session: any = null;
  constructor(private cdr: ChangeDetectorRef, private router: Router, private supabase: Supabase) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();

    await this.loadQuestions();
    this.startGame();

    this.loading = false;
    this.cdr.detectChanges();

    // Animación inicial del pato
    setTimeout(() => {
      this.duckyAnimation = 'deathRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.cdr.detectChanges();
      }, 650);
    }, 800);
  }

  // Carga las preguntas desde el JSON y las mezcla
  async loadQuestions() {
    const res = await fetch('/files/questions.json');
    this.questions = await res.json();
    this.shuffle(this.questions);
  }

  // Inicializa los valores del juego
  startGame() {
    this.currentIndex = 0;
    this.score = 0;
    this.currentQuestion = this.questions[this.currentIndex];
  }

  // Maneja la selección de una opción
  selectOption(option: string) {
    const correct = option === this.currentQuestion.answer;

    if (correct) {
      this.handleCorrectAnswer();
    } else {
      this.endGame(false); // Juego perdido
    }
  }

  // Siguiente pregunta o fin del juego si se acabaron
  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex >= this.questions.length) {
      this.endGame(true); // Juego ganado
    } else {
      this.currentQuestion = this.questions[this.currentIndex];
      this.cdr.detectChanges();
    }
  }

  //Manejo de fin de juego
  private async endGame(won: boolean) {
    // Registrar puntuación en la base de datos
    this.supabase.registerScore(this.session.user.email, this.score, null, 'trivia');

    // Configuración de la alerta
    const title = won ? '¡Ganaste! 🎉' : 'Incorrecto 😢';
    const text = won
      ? `Puntaje final: ${this.score}/${this.questions.length}`
      : `La respuesta era "${this.currentQuestion.answer}"`;
    const icon = won ? 'success' : 'error';

    // Animación del pato según resultado
    this.duckyAnimation = won ? 'sittingRight' : 'deathRight';
    this.cdr.detectChanges();

    // Mostrar la alerta
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Salir',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (result.isConfirmed) {
      this.restartGame();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      this.router.navigate(['/home']);
    }
  }

  // Reinicio del juego
  async restartGame() {
    this.loading = true;
    this.cdr.detectChanges();

    await this.loadQuestions();
    this.duckyAnimation = 'fallRight';
    this.startGame();

    this.loading = false;
    this.cdr.detectChanges();
  }

  // Mezcla aleatoriamente un array
  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Animación para respuesta correcta
  private handleCorrectAnswer() {
    this.score++;
    this.duckyAnimation = 'fallRight';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.duckyAnimation = 'sittingRight';
      this.cdr.detectChanges();
    }, 500);

    this.nextQuestion();
  }
}
