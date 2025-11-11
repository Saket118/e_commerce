import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/login/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser(); // get user data from localStorage

  // 🚫 Not logged in
  if (!auth.isLoggedIn() || !user) {
    router.navigate(['/admin/login']);
    return false;
  }

  // 🚫 If non-admin tries to access admin dashboard
  if (state.url.startsWith('/admin') && user.designation !== 'admin') {
    alert('Access Denied: Only admins can open the dashboard.');
    router.navigate(['/home']);
    return false;
  }

  // ✅ Otherwise allow access
  return true;
};
