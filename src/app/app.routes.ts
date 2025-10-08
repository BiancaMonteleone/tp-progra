import { Routes } from '@angular/router';
import { notLoggedGuard } from './guards/not-logged-guard';
import { isLoggedGuard } from './guards/is-logged-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import("./pages/login/login").then((a) => a.Login), canActivate: [notLoggedGuard]},
  { path: 'register', loadComponent: () => import("./pages/register/register").then((a) => a.Register), canActivate: [notLoggedGuard]},
  { path: 'home', loadComponent: () => import("./pages/home/home").then((a) => a.Home)},
  { path: 'scores', loadComponent: () => import("./pages/scores/scores").then((a) => a.Scores)},
  { path: 'about-me', loadComponent: () => import("./pages/about-me/about-me").then((a) => a.AboutMe)},
  {path: 'chat', loadComponent: () => import("./pages/chat/chat").then((a) => a.Chat), canActivate: [isLoggedGuard]},
  {path: 'hangman', loadComponent: () => import("./pages/hangman/hangman").then((a) => a.Hangman), canActivate: [isLoggedGuard]},
  {path: 'cards', loadComponent: () => import("./pages/cards/cards").then((a) => a.Cards), canActivate: [isLoggedGuard]},
  {path: 'trivia', loadComponent: () => import("./pages/trivia/trivia").then((a) => a.Trivia), canActivate: [isLoggedGuard]},
  {path: 'word-or-color', loadComponent: () => import("./pages/word-or-color/word-or-color").then((a) => a.WordOrColor), canActivate: [isLoggedGuard]},
];
