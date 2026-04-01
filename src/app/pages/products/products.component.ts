import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategory = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.productService.getCategories().subscribe(res => {
      if (res.success) this.categories = res.data;
    });
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterByCategory(+params['category']);
      } else {
        this.loadAll();
      }
    });
  }

  loadAll() {
    this.selectedCategory = 0;
    this.productService.getAll().subscribe(res => {
      if (res.success) this.products = res.data;
    });
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    if (categoryId === 0) { this.loadAll(); return; }
    this.productService.getByCategory(categoryId).subscribe(res => {
      if (res.success) this.products = res.data;
    });
  }

  search() {
    if (!this.searchTerm.trim()) { this.loadAll(); return; }
    this.productService.search(this.searchTerm).subscribe(res => {
      if (res.success) this.products = res.data;
    });
  }
}
