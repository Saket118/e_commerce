import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login/auth-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  user: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log('🏠 Home Loaded User:', this.user);

    // ✅ If not logged in, redirect to login
    if (!this.user) {
      this.router.navigate(['/admin/login']);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
