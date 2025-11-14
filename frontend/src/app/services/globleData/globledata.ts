import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Globledata {
  private usersUrl = 'http://localhost:5000/users';
  private productsUrl = 'http://localhost:5000/products';
  private cartAllUrl = 'http://localhost:5000/cart/all';
  private wishlistAllUrl = 'http://localhost:5000/wishlist/all';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersUrl);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.productsUrl);
  }

  getCartAll(): Observable<any[]> {
    return this.http.get<any[]>(this.cartAllUrl);
  }

  getWishlistAll(): Observable<any[]> {
    return this.http.get<any[]>(this.wishlistAllUrl);
  }

  createProduct(form: FormData): Observable<any> {
    return this.http.post<any>(this.productsUrl, form);
  }
}
