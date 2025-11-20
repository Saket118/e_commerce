import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../share/header/header';
import { Footer } from '../share/footer/footer';
import { AuthService } from '../../services/login/auth-service';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  orders: any[] = [];

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (!user) {
      alert('Please login to view your orders.');
      this.router.navigate(['/admin/login'], { queryParams: { redirect: '/orders' } });
      return;
    }

    this.cartService.getUserOrders(user.id).subscribe({
      next: (res: any) => {
        this.orders = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      },
      error: (err: any) => {
        console.error('Orders fetch error', err);
        alert(err?.error?.message || 'Failed to load orders');
      }
    });
  }
}
