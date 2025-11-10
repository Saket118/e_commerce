import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/login/auth-service';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ must be declared for standalone components
  imports: [CommonModule, ReactiveFormsModule], // ✅ works only with standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        if (res.success) {
          const user = res.user;
          localStorage.setItem('user', JSON.stringify(user));

          if (user.status === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (user.status === 'user') {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Unknown user role. Access denied.';
          }
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Server error';
      },
    });
  }
}
