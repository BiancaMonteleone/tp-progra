import { Component, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ducky',
  imports: [CommonModule],
  templateUrl: './ducky.html',
  styleUrl: './ducky.css',
})
export class Ducky {
  // Inputs 
  @Input() animation: string = 'floating';
  @Input() movement: string = 'hidden';

  // Propiedades internas
  currentSprite: string = ''; // Sprite actual a mostrar
  intervalId: any; // ID del setInterval para animaciones
  positionClass = 'floating'; // Clase CSS para controlar posición

  constructor(private cdr: ChangeDetectorRef) {}

  // Detecta cambios en los inputs
  ngOnChanges(changes: SimpleChanges) {
    if (changes['animation']) this.playAnimation(this.animation);
    if (changes['movement']) this.updateMovement(this.movement);
  }

  // Reproduce la animación actual
  public playCurrentAnimation() {
    this.playAnimation(this.animation);
  }

  // Lógica de animaciones
  private playAnimation(anim: string) {
    // Detiene cualquier animación anterior
    clearInterval(this.intervalId);

    let sprites: string[] = []; // Lista de sprites para la animación
    let loop = true; // Indica si la animación se repite
    let time = 0; // Intervalo entre sprites en ms

    // Definición de sprites según animación
    switch (anim) {
      // Animaciones flotando
      case 'floatingRight':
        sprites = [
          `/img/ducky/floating-right-00.png`,
          `/img/ducky/floating-right-01.png`,
          `/img/ducky/floating-right-00.png`,
        ];
        loop = true;
        time = 60;
        break;

      case 'floatingLeft':
        sprites = [
          `/img/ducky/floating-left-00.png`,
          `/img/ducky/floating-left-01.png`,
          `/img/ducky/floating-left-00.png`,
        ];
        loop = true;
        time = 60;
        break;

      // Animaciones de caída
      case 'fallRight':
        sprites = [`/img/ducky/fall-right.png`];
        loop = false;
        time = 100;
        break;
      case 'fallLeft':
        sprites = [`/img/ducky/fall-left.png`];
        loop = false;
        time = 100;
        break;

      // Animaciones sentadas
      case 'sittingRight':
        sprites = [`/img/ducky/sitting-right.png`];
        loop = false;
        time = 100;
        break;
      case 'sittingLeft':
        sprites = [`/img/ducky/sitting-left.png`];
        loop = false;
        time = 100;
        break;

      // Animaciones de muerte
      case 'deathRight':
        sprites = [`/img/ducky/death-right.png`];
        loop = false;
        time = 100;
        break;
      case 'deathLeft':
        sprites = [`/img/ducky/death-left.png`];
        loop = false;
        time = 100;
        break;

      // Animaciones caminando
      case 'walkRight':
        sprites = [
          `/img/ducky/walk-right-00.png`,
          `/img/ducky/walk-right-01.png`,
          `/img/ducky/walk-right-02.png`,
          `/img/ducky/walk-right-03.png`,
        ];
        loop = true;
        time = 150;
        break;

      // Animaciones escondiéndose
      case 'hideRight':
        sprites = [`/img/ducky/hide-right.png`];
        loop = false;
        time = 100;
        break;

      // Animaciones escalando
      case 'climb':
        sprites = [
          `/img/ducky/climb-00.png`,
          `/img/ducky/climb-01.png`,
          `/img/ducky/climb-02.png`,
          `/img/ducky/climb-03.png`,
        ];
        loop = true;
        time = 60;
        break;

      // Animaciones saltando
      case 'jump':
        sprites = [
          `/img/ducky/jump-00.png`,
          `/img/ducky/jump-01.png`,
          `/img/ducky/jump-02.png`,
          `/img/ducky/jump-03.png`,
          `/img/ducky/jump-00.png`,
        ];
        loop = false;
        time = 150;
        break;

      case 'jumpLeft':
        sprites = [
          `/img/ducky/jump-left-00.png`,
          `/img/ducky/jump-left-01.png`,
          `/img/ducky/jump-left-02.png`,
          `/img/ducky/jump-left-03.png`,
        ];
        loop = false;
        time = 100;
        break;

      // Animaciones rodando
      case 'roll':
        sprites = [
          `/img/ducky/roll-02.png`,
          `/img/ducky/roll-03.png`,
          `/img/ducky/roll-00.png`,
          `/img/ducky/roll-01.png`,
        ];
        loop = true;
        time = 100;
        break;

      // Animaciones choque
      case 'crash':
        sprites = [`/img/ducky/crash-01.png`, `/img/ducky/crash-00.png`];
        loop = false;
        time = 400;
        break;
    }

    // Reproduce la animación
    let index = 0;
    this.currentSprite = sprites[0];

    this.intervalId = setInterval(() => {
      index++;
      if (index < sprites.length) {
        this.currentSprite = sprites[index];
        this.cdr.detectChanges();
      } else if (loop) {
        index = 0;
        this.currentSprite = sprites[index];
        this.cdr.detectChanges();
      } else {
        clearInterval(this.intervalId);
      }
    }, time);
  }

  // Actualiza el movimiento
  private updateMovement(movement: string) {
    switch (movement) {
      case 'enterAboutMe':
        this.positionClass = 'enter-about-me';
        break;
      case 'enterLogin':
        this.positionClass = 'enter-login';
        break;
      case 'enterRegister':
        this.positionClass = 'enter-register';
        break;
      case 'enterHangman':
        this.positionClass = 'enter-hangman';
        break;
      case 'enterCards':
        this.positionClass = 'enter-cards';
        break;
      case 'enterChat':
        this.positionClass = 'enter-chat';
        break;
      case 'enterTrivia':
        this.positionClass = 'enter-trivia';
        break;
      case 'enterWordOrColor':
        this.positionClass = 'enter-word-or-color';
        break;
      case 'enterScores':
        this.positionClass = 'enter-scores';
        break;
    }
  }
}
