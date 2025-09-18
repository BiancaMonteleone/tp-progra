import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { AboutMe } from './components/about-me/about-me';
import { notLoggedGuard } from './guards/not-logged-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import("./components/login/login").then((a) => a.Login), canActivate: [notLoggedGuard]},
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'about-me', component: AboutMe },
];
