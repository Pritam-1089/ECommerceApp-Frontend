import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { LoaderComponent } from '../../shared/loader/loader.component';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent,LoaderComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];

  searchTerm = '';
  selectedCategory = 0;

  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterByCategory(+params['category']);
      } else {
        this.loadAll();
      }
    });
  }

  // ✅ Load Categories
  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        if (res.success) this.categories = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Load All Products
  loadAll() {
  this.loading = true;
  this.error = null;
  this.selectedCategory = 0;

  this.productService.getAll().subscribe({
    next: (res) => {
      console.log('API Response:', res);

      if (res.success) {
        this.products = res.data || [];
      }

      this.loading = false; // ✅ FIX
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load products';

      this.loading = false; // ✅ FIX
    }
  });
}


  // ✅ Filter by Category
  filterByCategory(categoryId: number) {
    this.loading = true;
    this.error = null;
    this.selectedCategory = categoryId;

    if (categoryId === 0) {
      this.loadAll();
      return;
    }

    this.productService.getByCategory(categoryId).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
        }
   
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load category products';
        
      }
    });
  }

  // ✅ Search
  search() {
    this.loading = true;
    this.error = null;

    if (!this.searchTerm.trim()) {
      this.loadAll();
      return;
    }

    this.productService.search(this.searchTerm).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
        }
       
      },
      error: (err) => {
        console.error(err);
        this.error = 'Search failed';
        
      }
    });
  }
}
