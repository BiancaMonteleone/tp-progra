import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Ducky } from '../../components/ducky/ducky';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-about-me',
  imports: [CommonModule, Ducky, Loading],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
})
export class AboutMe implements OnInit {
  user: any = null;
  userPath: string = 'https://api.github.com/users/BiancaMonteleone';
  loading = true;
  error = '';
  duckyAnimation = 'floatingRight';
  duckyMovement = 'enterAboutMe';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef){};
  
  ngOnInit(): void {
    this.loadUser();
    this.loading = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.duckyAnimation = 'fallRight';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.duckyAnimation = 'sittingLeft'
        this.cdr.detectChanges();
      }, 550)
    }, 1800)
  }

  loadUser(){
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
      }
    })
  }
}
