import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register/register-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  user = {
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    gender: ''
  };

  loading = false;

  constructor(private registerservice: RegisterService, private router: Router) {}

  onSubmit() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      alert('Please fill all required fields!');
      return;
    }

    this.loading = true;

    this.registerservice.registerUser(this.user).subscribe({
      next: (res) => {
        alert(res.message || '✅ Registered successfully!');
        this.loading = false;
        if (res.success) this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error.message || '❌ Registration failed.');
        this.loading = false;
      }
    });
  }
}
