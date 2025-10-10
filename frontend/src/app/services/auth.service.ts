import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/admin/login'; // Your backend API

  constructor(private http: HttpClient) { }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(res => {
        if (res.success) {
          // Save login state in localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('adminEmail', res.user.email); // optional
        }
      })
    );
  }

  // Logout method
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminEmail');
  }

  // Check login state
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
