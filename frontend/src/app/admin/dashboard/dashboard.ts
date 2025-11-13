import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/login/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  user: any;
  private popStateHandler = () => {
    history.pushState(null, '', window.location.href);
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log('🧩 Dashboard Loaded User:', this.user);
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', this.popStateHandler);
  }



  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.popStateHandler);
  }
}
