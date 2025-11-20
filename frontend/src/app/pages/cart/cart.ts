import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../share/header/header';
import { Footer } from '../share/footer/footer';
import { CurrencyService, Currency } from '../../services/currency/currency.service';
import { AuthService } from '../../services/login/auth-service';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  items: any[] = [];
  currentCurrency: Currency | null = null;

  constructor(
    private router: Router,
    private currencyService: CurrencyService,
    private auth: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    try {
      const stored = localStorage.getItem('cart');
      this.items = stored ? JSON.parse(stored) : [];
    } catch {
      this.items = [];
    }

    this.currencyService.currency$.subscribe(cur => {
      this.currentCurrency = cur;
    });
  }

  formatPrice(basePrice: number): string {
    const currency = this.currentCurrency || this.currencyService.getCurrentCurrency();
    const rate = currency.rate ?? 1;
    const converted = basePrice * rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }

  updateQuantity(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let qty = parseInt(input.value, 10);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
    }
    this.items[index].quantity = qty;
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
  }

  checkout() {
    if (!this.items.length) {
      alert('Your cart is empty');
      return;
    }

    const user = this.auth.getUser();
    if (!user) {
      alert('Please login to place an order.');
      this.router.navigate(['/admin/login'], { queryParams: { redirect: '/cart' } });
      return;
    }

    this.cartService.placeOrder({ user_id: user.id }).subscribe({
      next: (res: any) => {
        this.items = [];
        localStorage.removeItem('cart');
        alert(res?.message || 'Order placed successfully');
        this.router.navigate(['/orders']);
      },
      error: (err: any) => {
        console.error('Order error', err);
        alert(err?.error?.message || 'Failed to place order');
      }
    });
  }
}
