import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../Services/admin-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  get f() { return this.addUserForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.addUserForm.invalid) return;

    const { name, email, phone, gender, role, password } = this.addUserForm.value;

    this.dataService.addUser({ name, email, phone, gender, role, password }).subscribe({
      next: (res) => {
        this.successMessage = 'User added successfully!';
        this.addUserForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error adding user. Please try again.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
