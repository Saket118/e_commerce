import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UserDataComponent } from './admin/user-data/user-data.component';

import { ProductComponent } from './admin/product/product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { InvoiceComponent } from './admin/invoice/invoice.component';
import { InventryComponent } from './admin/inventry/inventry.component';
import { AddUserComponent } from './admin/adduser/adduser.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/user', component: UserDataComponent, canActivate: [AuthGuard] },
  { path: 'admin/product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'admin/order', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'admin/invoice', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'admin/report', component: InvoiceComponent, canActivate: [AuthGuard] },
  { path: 'admin/inventry', component: InventryComponent, canActivate: [AuthGuard] },
  { path: 'admin/adduser', component: AddUserComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'admin/login' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
