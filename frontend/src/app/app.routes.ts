import { Routes } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { Dashboard } from './admin/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';

export const routes: Routes = [
    
    { path: 'admin/login', component: LoginComponent },
    { path: 'admin/dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'home', component: Home, canActivate: [authGuard] },
     { path: 'register', component: Register },
     { path: '', redirectTo: 'admin/login', pathMatch: 'full' } 
];
