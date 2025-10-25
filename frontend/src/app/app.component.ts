import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide header/footer on login and register pages
        const hideOn = ['/admin/login', '/register', '/admin/dashboard'];
        this.showHeaderFooter = !hideOn.includes(event.urlAfterRedirects);
      }
    });
  }
}
