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
  // Juego y puntaje actual
  scores: any[] = [];
  currentGame = 'hangman';
  currentGameScores: any[] = []
  
  // Animaciones de Ducky
  duckyAnimation = 'walkRight';
  duckyMovement = 'enterScores';
  
  loading = true;
  
  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    // Obtener puntajes y filtrar por juego actual
    this.scores = await this.supabase.getScores();
    this.showGame(this.currentGame);
    this.loading = false;

    // Animación inicial del pato
    setTimeout(() => {
      this.duckyAnimation = 'sittingLeft';
      this.cdr.detectChanges();
    }, 3000);

    this.cdr.detectChanges();
  }

  // Actualiza el juego actual y filtra sus puntajes
  showGame(game: string) {
    this.currentGame = game;
    this.currentGameScores = this.scores.filter(
      (s) => s.game?.toLowerCase() === game.toLowerCase()
    );
  }
}
