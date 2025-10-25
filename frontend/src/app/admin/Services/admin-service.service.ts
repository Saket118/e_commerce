import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:5000'; // Backend base URL

  constructor(private http: HttpClient) { }

  // Get all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

 addUser(user: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Addusers`, user);
  }

  // Optional: Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/users/${userId}`);
  }

  // Optional: Update user
  updateUser(userId: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${userId}`, user);
  }

 addProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products`, formData);
  }

  // Get all products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`);
  }

  // Get all orders
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }

  // Get all invoices
  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/invoices`);
  }

  // Get inventory
  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventory`);
  }
}
