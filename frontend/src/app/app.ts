import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/login/auth-service';
import { Sidebar } from './pages/share/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,Sidebar,RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  user: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Load current user from AuthService
    this.user = this.auth.getUser();
    console.log('🧩 App Loaded User:', this.user);

    // ✅ If not logged in → go to login
    if (!this.user) {
      this.router.navigate(['/admin/login']);
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
