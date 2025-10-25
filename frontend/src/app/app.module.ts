import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { UserDataComponent } from './admin/user-data/user-data.component';
import { ProductComponent } from './admin/product/product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { InvoiceComponent } from './admin/invoice/invoice.component';
import { InventryComponent } from './admin/inventry/inventry.component';
import { AddUserComponent } from './admin/adduser/adduser.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/share/header/header.component';
import { FooterComponent } from './pages/share/footer/footer.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    UserDataComponent,
    ProductComponent,
    OrdersComponent,
    InvoiceComponent,
    InventryComponent,
    AddUserComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
