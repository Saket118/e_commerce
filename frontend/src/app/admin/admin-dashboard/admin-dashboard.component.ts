import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../Services/admin-service.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  sidebarOpen = true;
  products: any[] = []; // Fetched products

  // Dashboard cards
  dashboardCards = [
    { title: 'Total Users', count: 150, bgClass: 'bg-primary' },
    { title: 'Total Orders', count: 320, bgClass: 'bg-success' },
    { title: 'Total Products', count: 0, bgClass: 'bg-warning' },
    { title: 'Revenue', count: 12000, bgClass: 'bg-danger' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: DataService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ✅ Load products from service
  loadProducts(): void {
    this.adminService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // Update Total Products card count dynamically
        const productCard = this.dashboardCards.find(card => card.title === 'Total Products');
        if (productCard) productCard.count = this.products.length;
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }

  // ✅ Toggle sidebar visibility
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ✅ Logout user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
