import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { CurrencyService, Currency } from '../GlobleService/currency.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  selectedCurrency: Currency = { symbol: '€', code: 'EUR' };
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    // Subscribe to currency changes
    this.currencyService.currency$.subscribe(cur => this.selectedCurrency = cur);

    // Subscribe to cart changes
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Change quantity
  updateQuantity(item: CartItem, delta: number) {
    item.quantity += delta;
    if (item.quantity < 1) item.quantity = 1;
    this.cartService.addToCart(item); // update cart
    this.calculateTotal();
  }

  // Remove item
  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

  // Format price with currency
  formatPrice(price: number) {
    return `${this.selectedCurrency.symbol}${price.toFixed(2)}`;
  }
}
