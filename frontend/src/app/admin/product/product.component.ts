import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../Services/admin-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private productservice: DataService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [null, Validators.required]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('quantity', this.productForm.get('quantity')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('image', this.productForm.get('image')?.value);

    // 🔹 Send data to service
    this.productservice.addProduct(formData).subscribe({
      next: (response) => {
        console.log('✅ Product added:', response);
        alert('✅ Product Added Successfully!');
        this.productForm.reset();
        this.imagePreview = null;
      },
      error: (error) => {
        console.error('❌ Error adding product:', error);
        alert('❌ Failed to add product. Please try again.');
      }
    });
  }
}

