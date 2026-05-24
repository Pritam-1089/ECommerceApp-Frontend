import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { Product, CreateProduct, Category } from '../../../models/product.model';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  // 👇 Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

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
        if (res.success) this.categories = res.data;
      },
      error: () => this.notification.showError('Failed to load categories')
    });
  }

  loadProducts() {
    this.productService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data;
          this.totalPages = res.totalPages ?? 1;
        }
      },
      error: () => this.notification.showError('Failed to load products')
    });
  }

  onPageChange(event: { page: number; size: number }) {
    this.currentPage = event.page;
    this.pageSize = event.size;
    this.loadProducts();
  }

  saveProduct() {
    if (this.editingId) {
      this.productService.update(this.editingId, this.form).subscribe({
        next: () => {
          this.notification.showSuccess('Product updated successfully');
          this.cancelEdit();
          this.loadProducts();
        },
        error: () => this.notification.showError('Failed to update product')
      });
    } else {
      this.productService.create(this.form).subscribe({
        next: () => {
          this.notification.showSuccess('Product created successfully');
          this.resetForm();
          this.loadProducts();
        },
        error: () => this.notification.showError('Failed to create product')
      });
    }
  }

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

  deleteProduct(id: number) {
    if (confirm('Are you sure?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.notification.showSuccess('Product deleted successfully');
          this.loadProducts();
        },
        error: () => this.notification.showError('Failed to delete product')
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.resetForm();
  }

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