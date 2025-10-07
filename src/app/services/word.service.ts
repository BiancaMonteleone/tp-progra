import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private jsonUrl = '/files/words.json';

  constructor(private http: HttpClient) {}

  // Obtiene una palabra aleatoria del JSON
  getRandomWord(): Observable<string[]> {
    return this.http.get<{ words: string[] }>(this.jsonUrl).pipe(
      map((data) => {
        const random = data.words[Math.floor(Math.random() * data.words.length)];
        return [random];
      })
    );
  }
}
