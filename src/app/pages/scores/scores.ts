import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Loading } from '../../components/loading/loading';
import { Ducky } from '../../components/ducky/ducky';

@Component({
  selector: 'app-scores',
  imports: [CommonModule, Loading, Ducky],
  templateUrl: './scores.html',
  styleUrl: './scores.css',
})
export class Scores implements OnInit {
  currentGame = 'hangman';
  loading = true;
  scores: any[] = [];
  currentGameScores: any[] = [];
  duckyAnimation = 'walkRight';
  duckyMovement = 'enterScores';

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.scores = await this.supabase.getScores();
    this.showGame(this.currentGame);
    this.loading = false;
    setTimeout(() => {
      this.duckyAnimation = 'sittingLeft';
      this.cdr.detectChanges();
    }, 3000);
    this.cdr.detectChanges(); // 👈 fuerza a Angular a renderizar los cambios
  }

  showGame(game: string) {
    this.currentGame = game;
    this.currentGameScores = this.scores.filter(
      (s) => s.game?.toLowerCase() === game.toLowerCase()
    );
  }
}
