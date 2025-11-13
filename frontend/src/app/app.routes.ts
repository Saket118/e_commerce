import { Routes } from '@angular/router';
import { Login } from './admin/login/login';
import { Dashboard } from './admin/dashboard/dashboard';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';
import { AdminLayout } from './admin/layout/admin-layout';
import { UserInfo } from './admin/user-info/user-info';
import { Register } from './pages/register/register';
import { ProductInfo } from './admin/product-info/product-info';
import { Addproduct } from './admin/addproduct/addproduct';

export const routes: Routes = [

  { path: 'admin/login', component: Login },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      // Placeholder admin routes for sidebar links
      { path: 'users', component: UserInfo },
      { path: 'register', component: Register },
      { path: 'submodule/:id', component: Home },
      { path: 'orders', component: Home },
      { path: 'products', component: ProductInfo },
      { path: 'add-product', component: Addproduct },
      { path: 'customers', component: Home }
    ]
  },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }

];
