import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  sidebarOpen = true;

  // Dummy dashboard data
  dashboardCards = [
    { title: 'Total Users', count: 150, bgClass: 'bg-primary' },
    { title: 'Total Orders', count: 320, bgClass: 'bg-success' },
    { title: 'Total Products', count: 45, bgClass: 'bg-warning' },
    { title: 'Revenue', count: 12000, bgClass: 'bg-danger' },
  ];

  recentOrders = [
    { id: 101, user: 'Alice', total: 120, status: 'Pending', date: '2025-10-09' },
    { id: 102, user: 'Bob', total: 250, status: 'Completed', date: '2025-10-08' },
    { id: 103, user: 'Charlie', total: 75, status: 'Shipped', date: '2025-10-07' },
  ];

  topProducts = [
    { name: 'Product A', sold: 50 },
    { name: 'Product B', sold: 40 },
    { name: 'Product C', sold: 35 },
  ];

  lowStockProducts = [
    { name: 'Product X', stock: 5 },
    { name: 'Product Y', stock: 2 },
    { name: 'Product Z', stock: 3 },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.getElementById('sidebar-wrapper');
    if (sidebar) sidebar.style.display = this.sidebarOpen ? 'block' : 'none';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
