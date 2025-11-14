import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrencyService,Currency } from '../../../services/currency/currency.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],

})
export class Header implements OnInit {

  categories = [
    { id: 1, name: 'Desktops' },
    { id: 2, name: 'Laptops & Notebooks' },
    { id: 3, name: 'Components' },
    { id: 4, name: 'Tablets' },
    { id: 5, name: 'Software' },
    { id: 6, name: 'Phones & PDAs' },
    { id: 7, name: 'Cameras' },
    { id: 8, name: 'MP3 Players' }
  ];

  cartCount = 0;
  wishlistCount = 0;

  selectedCurrency: Currency = { symbol: '€', code: 'EUR', rate: 1 };
  currencies: Currency[] = [
    { symbol: '€', code: 'EUR', rate: 1 },
    { symbol: '$', code: 'USD', rate: 1.1 },
    { symbol: '₹', code: 'INR', rate: 90 }
  ];

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencyService.currency$.subscribe(cur => this.selectedCurrency = cur);

    try {
      const cart = localStorage.getItem('cart');
      this.cartCount = cart ? JSON.parse(cart).length : 0;
    } catch {
      this.cartCount = 0;
    }

    try {
      const wishlist = localStorage.getItem('wishlist');
      this.wishlistCount = wishlist ? JSON.parse(wishlist).length : 0;
    } catch {
      this.wishlistCount = 0;
    }
  }

  changeCurrency(currency: Currency, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.currencyService.setCurrency(currency);
    this.selectedCurrency = currency; // Update local state immediately
  }

}
