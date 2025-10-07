import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../../components/ducky/ducky';
import { Loading } from '../../components/loading/loading';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-or-color',
  imports: [CommonModule, Ducky, Loading],
  templateUrl: './word-or-color.html',
  styleUrl: './word-or-color.css',
})
export class WordOrColor implements OnInit, OnDestroy {
  // Estado general del juego
  score = 0;
  timer = 20;
  progress = 100;
  timerInterval: any;
  isRoundActive = false;
  
  // Colores disponibles
  colors = [
    { name: 'Rojo', hex: '#ff4d4d' },
    { name: 'Verde', hex: '#4dff4d' },
    { name: 'Azul', hex: '#3636ffff' },
    { name: 'Amarillo', hex: '#ffff4d' },
    { name: 'Naranja', hex: '#ffa64d' },
    { name: 'Violeta', hex: '#b84dff' },
  ];

  // Estado de la ronda actual
  displayWord: any;
  displayColor: any;

  // Animaciones de Ducky
  duckyAnimation = 'floatingRight';
  duckyMovement = 'enterWordOrColor';

  loading = true;
  session: any = null;

  constructor(private cdr: ChangeDetectorRef, private supabase: Supabase, private router: Router) {}

  async ngOnInit() {
    this.session = await this.supabase.getSession();
    this.loading = false;
    this.cdr.detectChanges();
    this.startGame();

    // Animación inicial del pato
    setTimeout(() => {
      this.duckyAnimation = 'sittingRight';
      this.cdr.detectChanges();
    }, 1800);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  // Temporizador
  startTimer() {
    const startTime = Date.now();
    const duration = 20000;
    this.progress = 100;

    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(duration - elapsed, 0);
      this.timer = Math.ceil(remaining / 1000);
      this.progress = (remaining / duration) * 100;
      this.cdr.detectChanges();

      if (remaining <= 0) {
        this.endGame('¡Se acabó el tiempo!');
      }
    }, 16);
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  // Juego
  startGame() {
    this.score = 0;
    this.isRoundActive = true;
    this.timer = 20;
    this.progress = 100;
    this.generateRound();
    this.startTimer();
  }

  // Genera una nueva ronda
  generateRound() {
    const word = this.colors[Math.floor(Math.random() * this.colors.length)];
    let color = this.colors[Math.floor(Math.random() * this.colors.length)];
    while (color.name === word.name) {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    this.displayWord = word;
    this.displayColor = color;
  }

  // Manejo de selección
  selectColor(selected: any) {
    if (!this.isRoundActive) return;

    // Animación del pato y siguiente ronda
    const correct = selected.name === this.displayColor.name;
    if (correct) {
      this.score++;
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();

      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.generateRound();
        this.cdr.detectChanges();
      }, 700);
    } else {
      this.endGame(`¡Fallaste! El color correcto era ${this.displayColor.name}`);
    }
  }

  // Fin de juego
  endGame(message: string) {
    this.isRoundActive = false;
    this.stopTimer();
    this.duckyAnimation = 'deathRight';
    this.cdr.detectChanges();

    // Registrar puntaje
    this.supabase.registerScore(this.session.user.email, this.score, null, 'word_or_color');

    // Mostrar modal de fin
    Swal.fire({
      title: message,
      text: `Tu puntuación: ${this.score}`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Salir',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) this.restartGame();
      else this.router.navigate(['/home']);
    });
  }

  // Reinicia el juego
  restartGame() {
    this.duckyAnimation = 'sittingRight';
    this.startGame();
  }
}
