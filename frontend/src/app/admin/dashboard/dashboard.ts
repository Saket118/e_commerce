import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  user: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log('🧩 Dashboard Loaded User:', this.user);
  }

  logout() {
    // ✅ Clear session/localStorage
    this.auth.logout();

    // ✅ Redirect to login
    this.router.navigate(['/admin/login']);
  }
}
