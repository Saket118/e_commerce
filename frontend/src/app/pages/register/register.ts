import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register/register-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  user = {
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    gender: ''
  };

  loading = false;

  isAdminMode = false;

  constructor(
    private registerservice: RegisterService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    this.isAdminMode = !!(isLoggedIn && user && user.designation === 'admin');
  }

  onSubmit() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      alert('Please fill all required fields!');
      return;
    }

    this.loading = true;

    this.registerservice.registerUser(this.user).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          if (this.isAdminMode) {
            alert(res.message || 'User added successfully!');
            this.router.navigate(['/admin/users']);
          } else {
            alert(res.message || '✅ Registered successfully! Please login.');
            this.router.navigate(['/admin/login']);
          }
        } else {
          alert(res.message || '❌ Registration failed.');
        }
      },
      error: (err) => {
        alert(err.error.message || '❌ Registration failed.');
        this.loading = false;
      }
    });
  }
}
