import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit{
  protected readonly title = signal('tp-progra');
  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = false;
    if(localStorage.getItem('user')){
      this.isLoggedIn = true;
    }
  }
}
