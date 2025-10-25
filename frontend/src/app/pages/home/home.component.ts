import { Component, OnInit } from '@angular/core';
import { DataService } from '../../admin/Services/admin-service.service';
import { CurrencyService, Currency } from '../../GlobleService/currency.service';
import { CartService, CartItem } from '../../services/cart.service';
// import { WishlistService, WishlistItem } from '../../services/wishlist.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  isLoading = true;

  selectedCurrency: Currency = { symbol: '€', code: 'EUR' };

  constructor(
    private productService: DataService,
    private currencyService: CurrencyService,
    private cartService: CartService,
    // private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Subscribe to currency changes
    this.currencyService.currency$.subscribe(cur => this.selectedCurrency = cur);

    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Error fetching products:', err);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imagePath: string): string {
    return imagePath
      ? `http://localhost:5000${imagePath}`
      : 'assets/images/no-image.png';
  }

  getFormattedPrice(price: number): string {
    return `${this.selectedCurrency.symbol}${price.toFixed(2)}`;
  }

  getExTaxPrice(price: number): string {
    return `${this.selectedCurrency.symbol}${(price * 0.83).toFixed(2)}`;
  }

  // Add product to cart
  addToCart(product: Product) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: this.getImageUrl(product.image)
    };
    this.cartService.addToCart(item);
    alert(`${product.name} added to cart!`);
  }

  // Wishlist functionality can be added later
  // addToWishlist(product: Product) {
  //   const item: WishlistItem = {
  //     id: product.id,
  //     name: product.name,
  //     price: product.price,
  //     image: this.getImageUrl(product.image)
  //   };
  //   this.wishlistService.addToWishlist(item);
  //   alert(`${product.name} added to wishlist!`);
  // }
}
