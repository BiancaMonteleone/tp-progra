import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Ducky } from '../ducky/ducky';

@Component({
  selector: 'app-about-me',
  imports: [CommonModule, Ducky],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
})
export class AboutMe implements OnInit {
  user: any = null;
  userPath: string = 'https://api.github.com/users/BiancaMonteleone';
  loading = true;
  error = '';
  duckyAnimation = 'floating';
  duckyMovement = 'enterTop';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef){};
  
  ngOnInit(): void {
    this.loadUser();
    setTimeout(() => {
      this.duckyAnimation = 'fall';
      this.duckyMovement = 'fall';
      this.cdr.detectChanges();
    }, 3000)
  }

  loadUser(){
    this.loading = true;
    this.error = '';
    this.http.get(this.userPath).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuario', err);
        this.error = 'Error al cargar la informacion del usuario';
        this.loading = false;
        this.cdr.detectChanges();
      }
    })
  }
}
