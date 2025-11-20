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
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Wishlist } from './pages/wishlist/wishlist';
import { CartInfo } from './admin/cart-info/cart-info';
import { WishlistInfo } from './admin/wishlist-info/wishlist-info';
import { OrdersInfo } from './admin/orders-info/orders-info';
import { Orders } from './pages/orders/orders';

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
      { path: 'products', component: ProductInfo },
      { path: 'add-product', component: Addproduct },
      { path: 'cart-list', component: CartInfo },
      { path: 'wishlist-list', component: WishlistInfo },
      { path: 'orders-list', component: OrdersInfo },
      { path: 'customers', component: Home }
    ]
  },
  { path: 'product/:id', component: ProductDetail },
  { path: 'cart', component: Cart },
  { path: 'wishlist', component: Wishlist },
  { path: 'orders', component: Orders },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }

];
