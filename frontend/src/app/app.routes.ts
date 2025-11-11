import { Routes } from '@angular/router';
import { Login } from './admin/login/login';
import { Dashboard } from './admin/dashboard/dashboard';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  { path: 'admin/login', component: Login },
  { path: 'admin/dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'home', component: Home, canActivate: [authGuard]   },
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin/login' }
];
