import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = false;
    if(localStorage.getItem('user')){
      this.isLoggedIn = true;
    }
  }
}
