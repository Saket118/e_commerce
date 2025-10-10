import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!loggedIn) {
      this.router.navigate(['/admin/login']); // redirect if not logged in
      return false;
    }

    return true; // allow route if logged in
  }
}
