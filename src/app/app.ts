import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App{
  protected readonly title = signal('tp-progra');
}
