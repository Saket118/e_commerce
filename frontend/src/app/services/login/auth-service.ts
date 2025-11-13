import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/admin/login';
  private isBrowser = false;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && res.user.status === 'active') {
          // ✅ Save session details in localStorage
          if (this.isBrowser) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } else if (res.user && res.user.status === 'inactive') {
          alert('Your account is inactive. Please contact admin.');
          if (this.isBrowser) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
          }
        } else {
          if (this.isBrowser) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
          }
        }
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/admin/profile', { withCredentials: true });
  }

  serverLogout(): Observable<any> {
    return this.http.post<any>('http://localhost:5000/admin/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        if (this.isBrowser) {
          localStorage.clear();
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isBrowser && localStorage.getItem('isLoggedIn') === 'true';
  }

  getUser() {
    if (!this.isBrowser) return null;
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
}
