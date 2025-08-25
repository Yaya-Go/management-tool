import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Project } from './project/project';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'signin',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'project/:id',
    component: Project,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
