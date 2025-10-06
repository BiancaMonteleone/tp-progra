import { Component, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ducky',
  imports: [CommonModule],
  templateUrl: './ducky.html',
  styleUrl: './ducky.css',
})
export class Ducky {
  @Input() animation: string = 'floating';
  @Input() movement: string = 'hidden';

  currentSprite: string = '';
  intervalId: any;
  positionClass = 'floating';
  @Input() shake: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {  
    if (changes['animation']) this.playAnimation(this.animation);
    if (changes['movement']) this.updateMovement(this.movement);
  }

  public playCurrentAnimation() {
    this.playAnimation(this.animation);
  }

  private playAnimation(anim: string) {
    clearInterval(this.intervalId);

    let sprites: string[] = [];
    let loop = true;
    let time = 0;

    switch (anim) {
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
      //-------------------------------------------
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
      //-------------------------------------------
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
      //-------------------------------------------
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
      //-------------------------------------------
      case 'walkRight':
        sprites = [`/img/ducky/walk-right-00.png`,
          `/img/ducky/walk-right-01.png`,
          `/img/ducky/walk-right-02.png`,
          `/img/ducky/walk-right-03.png`
        ];
        loop = true;
        time = 150;
        break;
      //-------------------------------------------
      case 'hideRight':
        sprites = [`/img/ducky/hide-right.png`];
        loop = false;
        time = 100;
        break;
      //-------------------------------------------
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
      //-------------------------------------------
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
      //-------------------------------------------
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
      //-------------------------------------------
      case 'crash':
        sprites = [
          `/img/ducky/crash-01.png`,
          `/img/ducky/crash-00.png`,
        ];
        loop = false;
        time = 400;
        break;
    }

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
      case 'hidden':
        this.positionClass = 'hidden';
        break;
    }
  }
}
