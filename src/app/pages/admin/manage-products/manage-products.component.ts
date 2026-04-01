import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
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
  form: CreateProduct = { name: '', description: '', sku: '', price: 0, discountPrice: null, stockQuantity: 0, imageUrl: '', categoryId: 0 };
  editingId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.productService.getCategories().subscribe(res => { if (res.success) this.categories = res.data; });
  }

  loadProducts() {
    this.productService.getAll().subscribe(res => { if (res.success) this.products = res.data; });
  }

  saveProduct() {
    if (this.editingId) {
      this.productService.update(this.editingId, this.form).subscribe(() => { this.cancelEdit(); this.loadProducts(); });
    } else {
      this.productService.create(this.form).subscribe(() => { this.resetForm(); this.loadProducts(); });
    }
  }

  editProduct(p: Product) {
    this.editingId = p.id;
    this.form = { name: p.name, description: p.description, sku: p.sku, price: p.price, discountPrice: p.discountPrice, stockQuantity: p.stockQuantity, imageUrl: p.imageUrl, categoryId: p.categoryId };
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure?')) {
      this.productService.delete(id).subscribe(() => this.loadProducts());
    }
  }

  cancelEdit() { this.editingId = null; this.resetForm(); }

  resetForm() { this.form = { name: '', description: '', sku: '', price: 0, discountPrice: null, stockQuantity: 0, imageUrl: '', categoryId: 0 }; }
}
