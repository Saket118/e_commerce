import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ProductInventory {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-inventry',
  templateUrl: './inventry.component.html',
  styleUrls: ['./inventry.component.css']
})
export class InventryComponent implements OnInit {

  inventory: ProductInventory[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkAccess();

    // Mock inventory data
    this.inventory = [
      { id: 1, name: 'Product A', sku: 'SKU001', quantity: 50, price: 100 },
      { id: 2, name: 'Product B', sku: 'SKU002', quantity: 20, price: 150 },
      { id: 3, name: 'Product C', sku: 'SKU003', quantity: 0, price: 200 }
    ];
  }

  checkAccess() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

}
