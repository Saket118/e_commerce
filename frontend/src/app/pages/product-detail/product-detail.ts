import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../share/header/header';
import { Footer } from '../share/footer/footer';
import { Globledata } from '../../services/globleData/globledata';
import { CurrencyService, Currency } from '../../services/currency/currency.service';
import { AuthService } from '../../services/login/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { WishlistService } from '../../services/wishlist/wishlist-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  product: any = null;
  currentCurrency: Currency | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globledata: Globledata,
    private currencyService: CurrencyService,
    private auth: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }

    this.globledata.getProducts().subscribe({
      next: (res: any[]) => {
        const all = res || [];
        this.product = all.find(p => String(p.id) === String(id)) || null;
        if (!this.product) {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.router.navigate(['/home']);
      }
    });

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

  addToCart(item: any) {
    const user = this.auth.getUser();
    if (!user) {
      alert('Please login to add items to cart.');
      this.router.navigate(['/admin/login'], { queryParams: { redirect: `/product/${item.id}` } });
      return;
    }

    this.cartService.addToCart({
      user_id: user.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    }).subscribe({
      next: (res) => {
        try {
          const stored = localStorage.getItem('cart');
          const cart = stored ? JSON.parse(stored) : [];
          cart.push({ ...item, quantity: 1 });
          localStorage.setItem('cart', JSON.stringify(cart));
        } catch {}
        alert(res?.message || 'Added to cart');
      },
      error: (err) => {
        console.error('Cart error', err);
        alert(err?.error?.message || 'Failed to add to cart');
      }
    });
  }

  addToWishlist(item: any) {
    const user = this.auth.getUser();
    if (!user) {
      alert('Please login to add items to wishlist.');
      this.router.navigate(['/admin/login'], { queryParams: { redirect: `/product/${item.id}` } });
      return;
    }

    this.wishlistService.addToWishlist({
      user_id: user.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    }).subscribe({
      next: (res) => {
        try {
          const stored = localStorage.getItem('wishlist');
          const wishlist = stored ? JSON.parse(stored) : [];
          wishlist.push(item);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch {}
        alert(res?.message || 'Added to wishlist');
      },
      error: (err) => {
        console.error('Wishlist error', err);
        alert(err?.error?.message || 'Failed to add to wishlist');
      }
    });
  }

  buyNow(item: any) {
    this.addToCart(item);
    this.router.navigate(['/cart']);
  }
}
