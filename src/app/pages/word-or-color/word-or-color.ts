import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Ducky } from '../../components/ducky/ducky';
import { Loading } from '../../components/loading/loading';
import { Modal } from '../../components/modal/modal';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-or-color',
  imports: [CommonModule, Ducky, Loading, Modal],
  templateUrl: './word-or-color.html',
  styleUrl: './word-or-color.css',
})
export class WordOrColor implements OnInit, OnDestroy {
  loading = true;
  score = 0;
  duckyAnimation = 'floatingRight';
  duckyMovement = 'enterWordOrColor';
  user: any = null;
  timer = 20; // segundos
  progress = 100;
  timerInterval: any;
  isRoundActive = false;

  colors = [
    { name: 'Rojo', hex: '#ff4d4d' },
    { name: 'Verde', hex: '#4dff4d' },
    { name: 'Azul', hex: '#4d4dff' },
    { name: 'Amarillo', hex: '#ffff4d' },
    { name: 'Naranja', hex: '#ffa64d' },
    { name: 'Violeta', hex: '#b84dff' },
  ];

  displayWord: any;
  displayColor: any;

  modalMessage = '';
  isModalOpen = false;

  constructor(private cdr: ChangeDetectorRef, private supabase: Supabase, private router: Router) {}

  async ngOnInit() {
    this.user = await this.supabase.getUser();
    this.loading = false;
    this.cdr.detectChanges();
    this.startGame();

    // Animaciones del pato
    setTimeout(() => {
      this.duckyAnimation = 'sittingRight';
      this.cdr.detectChanges();
    }, 1800);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    const startTime = Date.now();
    const duration = 20000; // 60 segundos
    this.progress = 100;

    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(duration - elapsed, 0);
      this.timer = Math.ceil(remaining / 1000); // segundos restantes
      this.progress = (remaining / duration) * 100;
      this.cdr.detectChanges();

      if (remaining <= 0) {
        this.endGame('¡Se acabó el tiempo!');
      }
    }, 16); // ~60 FPS
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startGame() {
    this.score = 0;
    this.isRoundActive = true;
    this.timer = 20; // temporizador global
    this.progress = 100;
    this.generateRound(); // palabra inicial
    this.startTimer(); // iniciar solo 1 vez
  }

  generateRound() {
    const word = this.colors[Math.floor(Math.random() * this.colors.length)];
    let color = this.colors[Math.floor(Math.random() * this.colors.length)];
    while (color.name === word.name) {
      color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    this.displayWord = word;
    this.displayColor = color;
  }

  timeOut() {
    this.isRoundActive = false;
    this.stopTimer();
    this.duckyAnimation = 'deathRight';
    this.cdr.detectChanges();

    // animar barra suavemente a 0
    const step = this.progress / 10;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      this.progress -= step;
      this.cdr.detectChanges();
      if (i >= 10) clearInterval(interval);
    }, 50);

    this.supabase.registerScore(this.user.auth_id, this.score, 'word_or_color_scores');
    Swal.fire({
      title: '¡Se acabó el tiempo! ⏱️',
      text: `Tu puntaje es ${this.score}`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Salir',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) this.restartGame();
      else this.router.navigate(['/home']);
    });
  }

  selectColor(selected: any) {
    if (!this.isRoundActive) return;

    const correct = selected.name === this.displayColor.name;
    if (correct) {
      this.score++;
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();

      setTimeout(() => {
        this.duckyAnimation = 'sittingRight';
        this.generateRound(); // solo cambia palabra/color
        this.cdr.detectChanges();
      }, 700);
    } else {
      this.endGame(`¡Fallaste! El color correcto era ${this.displayColor.name}`);
    }
  }

  endGame(message: string) {
    this.isRoundActive = false;
    this.stopTimer();
    this.duckyAnimation = 'deathRight';
    this.cdr.detectChanges();
    this.supabase.registerScore(this.user.auth_id, this.score, 'word_or_color_scores');

    Swal.fire({
      title: message,
      text: `Tu puntuación: ${this.score}`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Salir',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) this.restartGame();
      else this.router.navigate(['/home']);
    });
  }

  restartGame() {
    this.duckyAnimation = 'sittingRight';
    this.startGame();
  }
}
