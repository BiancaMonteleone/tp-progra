import { Component, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ducky',
  imports: [CommonModule],
  templateUrl: './ducky.html',
  styleUrl: './ducky.css',
})
export class Ducky {
  @Input() animation: string = 'jump';
  @Input() movement: string = 'idleTop';
  @Input() size: number = 120;

  currentSprite: string = '';
  intervalId: any;
  positionClass = 'frog-idle';

  constructor(private cdr: ChangeDetectorRef){};

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
      case 'floating':
        sprites = [
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
          `/img/ducky/floating-01.png`,
          `/img/ducky/floating-00.png`,
        ];
        loop = false;
        time = 100;
        break;
      case 'fall':
        sprites = [
          `/img/ducky/fall.png`
        ];
        loop = false;
        time = 100;
        break;
    }

    let index = 0;
    this.currentSprite = sprites[0];

    this.intervalId = setInterval(() => {
      index++;

      if (index < sprites.length) {
        this.cdr.detectChanges();
        this.currentSprite = sprites[index];
      } else if (loop) {
        index = 0;
        this.currentSprite = sprites[index];
      } else {
        clearInterval(this.intervalId);
      }
    }, time);
  }

  private updateMovement(movement: string) {
    switch (movement) {
      case 'hidden':
        this.positionClass = 'hidden';
        break;
      case 'enterTop':
        this.positionClass = 'enter-top';
        break;
      case 'fall':
        this.positionClass = 'efall';
        break;
      default:
        this.positionClass = 'hidden';
    }
  }
}
