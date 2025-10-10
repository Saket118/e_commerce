import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../Services/admin-service.service';

interface User {
  id: number;
  name: string;
  email: string;
  phoneNo:string;
  gender:string;
  status: string;
}

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  users: User[] = [];

  constructor(private authService: AuthService,private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.checkAccess();

    // Mock user data
    this.dataService.getUsers().subscribe(data => {
      this.users = data;
    });
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
