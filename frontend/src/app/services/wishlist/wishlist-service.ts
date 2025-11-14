import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = 'http://localhost:5000/wishlist';

  constructor(private http: HttpClient) {}

  addToWishlist(payload: {
    user_id: number;
    product_id: number;
    name: string;
    price: number;
    image?: string | null;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
