
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/login/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ must include RouterModule
  templateUrl: './sidebar.html'
})
export class Sidebar {
  isSidebarOpen = true;

  constructor(private auth: AuthService, private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    console.log('🚪 Logging out...');
    this.auth.logout();

    // ✅ Navigate after logout
    this.router.navigate(['/admin/login']).then(success => {
      console.log('✅ Navigation to login:', success);
    });
  }
}
