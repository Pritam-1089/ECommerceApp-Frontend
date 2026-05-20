import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { Product, CreateProduct, Category } from '../../../models/product.model';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  form: CreateProduct = {
    name: '',
    description: '',
    sku: '',
    price: 0,
    discountPrice: null,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 0
  };

  editingId: number | null = null;

  constructor(
    private productService: ProductService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadProducts();

    this.productService.getCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories = res.data;
        }
      },
      error: () => {
        this.notification.showError(
          'Failed to load categories'
        );
      }
    });
  }

  // Load Products
  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data;
        }
      },
      error: () => {
        this.notification.showError(
          'Failed to load products'
        );
      }
    });
  }

  // Create + Update Product
  saveProduct() {

    // UPDATE PRODUCT
    if (this.editingId) {

      this.productService
        .update(this.editingId, this.form)
        .subscribe({
          next: () => {

            this.notification.showSuccess(
              'Product updated successfully'
            );

            this.cancelEdit();
            this.loadProducts();
          },

          error: () => {
            this.notification.showError(
              'Failed to update product'
            );
          }
        });

    }

    // CREATE PRODUCT
    else {

      this.productService
        .create(this.form)
        .subscribe({
          next: () => {

            this.notification.showSuccess(
              'Product created successfully'
            );

            this.resetForm();
            this.loadProducts();
          },

          error: () => {
            this.notification.showError(
              'Failed to create product'
            );
          }
        });
    }
  }

  // Edit Product
  editProduct(p: Product) {

    this.editingId = p.id;

    this.form = {
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: p.price,
      discountPrice: p.discountPrice,
      stockQuantity: p.stockQuantity,
      imageUrl: p.imageUrl,
      categoryId: p.categoryId
    };
  }

  // Delete Product
  deleteProduct(id: number) {

    if (confirm('Are you sure?')) {

      this.productService
        .delete(id)
        .subscribe({
          next: () => {

            this.notification.showSuccess(
              'Product deleted successfully'
            );

            this.loadProducts();
          },

          error: () => {
            this.notification.showError(
              'Failed to delete product'
            );
          }
        });
    }
  }

  // Cancel Edit
  cancelEdit() {
    this.editingId = null;
    this.resetForm();
  }

  // Reset Form
  resetForm() {
    this.form = {
      name: '',
      description: '',
      sku: '',
      price: 0,
      discountPrice: null,
      stockQuantity: 0,
      imageUrl: '',
      categoryId: 0
    };
  }
}