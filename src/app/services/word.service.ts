import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'https://random-word-api.herokuapp.com/word?number=1&lang=es';

  constructor(private http: HttpClient) {}

  getRandomWord(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
