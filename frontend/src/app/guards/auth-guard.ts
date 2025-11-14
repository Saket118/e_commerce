import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/login/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // If not running in the browser (e.g. during SSR), skip auth check here
  // and let the browser-side navigation decide.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const user = auth.getUser(); // get user data from localStorage

  // 🚫 Not logged in
  if (!auth.isLoggedIn() || !user) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: { redirect: state.url }
    });
  }

  // 🚫 If non-admin tries to access admin dashboard
  if (state.url.startsWith('/admin') && user.designation !== 'admin') {
    alert('Access Denied: Only admins can open the dashboard.');
    return router.createUrlTree(['/home']);
  }

  // ✅ Otherwise allow access
  return true;
};
