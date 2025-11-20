import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5000/cart';

  constructor(private http: HttpClient) {}

  addToCart(payload: {
    user_id: number;
    product_id: number;
    name: string;
    price: number;
    quantity?: number;
    image?: string | null;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  placeOrder(payload: { user_id: number }): Observable<any> {
    return this.http.post<any>('http://localhost:5000/orders', payload);
  }

  getUserOrders(userId: number): Observable<any> {
    return this.http.get<any>('http://localhost:5000/orders', {
      params: { user_id: userId }
    });
  }
}
