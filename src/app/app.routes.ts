import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutMe } from './pages/about-me/about-me';
import { notLoggedGuard } from './guards/not-logged-guard';
import { isLoggedGuard } from './guards/is-logged-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import("./pages/login/login").then((a) => a.Login), canActivate: [notLoggedGuard]},
  { path: 'register', loadComponent: () => import("./pages/register/register").then((a) => a.Register), canActivate: [notLoggedGuard]},
  { path: 'home', component: Home },
  { path: 'about-me', component: AboutMe },
  {path: 'chat', loadComponent: () => import("./pages/chat/chat").then((a) => a.Chat), canActivate: [isLoggedGuard]},
  {path: 'hangman', loadComponent: () => import("./pages/hangman/hangman").then((a) => a.Hangman), canActivate: [isLoggedGuard]},
];
