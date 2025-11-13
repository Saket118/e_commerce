import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Globledata } from '../../services/globleData/globledata';

@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addproduct.html',
  styleUrls: ['./addproduct.css'],
})
export class Addproduct {
  model = {
    name: '',
    price: '',
    quantity: '',
    description: ''
  };
  imageFile: File | null = null;
  preview: string | ArrayBuffer | null = null;
  loading = false;

  constructor(private api: Globledata, private router: Router) {}

  onFileChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    this.imageFile = file || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.preview = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.preview = null;
    }
  }

  onSubmit() {
    if (!this.model.name || !this.model.price || !this.model.quantity) {
      alert('Please fill required fields (name, price, quantity).');
      return;
    }
    if (!this.imageFile) {
      alert('Please select an image.');
      return;
    }
    const form = new FormData();
    form.append('name', this.model.name);
    form.append('price', this.model.price);
    form.append('quantity', this.model.quantity);
    form.append('description', this.model.description);
    form.append('image', this.imageFile);

    this.loading = true;
    this.api.createProduct(form).subscribe({
      next: (res) => {
        alert(res?.message || 'Product added');
        this.loading = false;
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to add product');
        this.loading = false;
      }
    });
  }
}
