import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private apiUrl = 'https://deckofcardsapi.com/api/deck';

  constructor(private http: HttpClient) {}

  generateDeck(): any[] {
    const suits = ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'];
    const values = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];

    const deck = [];

    for (const suit of suits) {
      for (const value of values) {
        deck.push({
          suit,
          value,
          image: `assets/cards/${value}_of_${suit}.png`, // o la ruta que tengas
        });
      }
    }

    return this.shuffle(deck); // barajar
  }

  // función simple para barajar
  shuffle(deck: any[]): any[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
}
