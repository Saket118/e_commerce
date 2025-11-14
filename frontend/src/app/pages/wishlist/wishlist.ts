import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../share/header/header';
import { Footer } from '../share/footer/footer';
import { CurrencyService, Currency } from '../../services/currency/currency.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class Wishlist implements OnInit {
  items: any[] = [];
  currentCurrency: Currency | null = null;

  constructor(
    private router: Router,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    try {
      const stored = localStorage.getItem('wishlist');
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

  moveToCart(index: number) {
    const item = this.items[index];
    try {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      cart.push({ ...item, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      this.removeItem(index);
      alert('Moved to cart');
    } catch {}
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(this.items));
  }

  clearWishlist() {
    this.items = [];
    localStorage.removeItem('wishlist');
  }
}
