import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login/auth-service';
import { Header } from '../../pages/share/header/header';
import { Footer } from '../../pages/share/footer/footer';
import { Globledata } from '../../services/globleData/globledata';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  user: any;
  products: any[] = [];

  constructor(private auth: AuthService, private router: Router, private globledata: Globledata) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log('🏠 Home Loaded User:', this.user);

    // ✅ If not logged in, redirect to login
    if (!this.user) {
      // no redirect: home is public
    }

    this.globledata.getProducts().subscribe({
      next: (res: any[]) => {
        this.products = res || [];
      },
      error: () => {
        this.products = [];
      }
    });
  }

  logout() {
    this.auth.serverLogout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }

  addToCart(item: any) {
    try {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      cart.push({ ...item, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart');
    } catch {}
  }

  addToWishlist(item: any) {
    try {
      const stored = localStorage.getItem('wishlist');
      const wishlist = stored ? JSON.parse(stored) : [];
      wishlist.push(item);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Added to wishlist');
    } catch {}
  }

  viewDetails(item: any) {
    alert(`Product: ${item.name}\nPrice: ${item.price}\n${item.description || ''}`);
  }
}
