import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Pagination } from '../../shared/components/pagination/pagination';  // 👈 apna path check karo

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoaderComponent, Pagination],  // 👈 add kiya
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

  // 👇 Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router   // 👈 add kiya
  ) {}

  ngOnInit() {
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      // URL se page/size uthao agar hai toh
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.pageSize = params['size'] ? +params['size'] : 10;

      if (params['category']) {
        this.filterByCategory(+params['category']);
      } else {
        this.loadAll();
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        if (res.success) this.categories = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  loadAll() {
    this.loading = true;
    this.error = null;
    this.selectedCategory = 0;

    // 👇 page aur pageSize pass karo
    this.productService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
          this.totalPages = res.totalPages || 1;  // 👈 backend se aana chahiye
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: number) {
    this.currentPage = 1;
    this.loading = true;
    this.error = null;
    this.selectedCategory = categoryId;

    if (categoryId === 0) {
      this.loadAll();
      return;
    }

    this.productService.getByCategory(categoryId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
          this.totalPages = res.totalPages || 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load category products';
        this.loading = false;
      }
    });
  }

  search() {
    this.currentPage = 1; 
    this.loading = true;
    this.error = null;

    if (!this.searchTerm.trim()) {
      this.loadAll();
      return;
    }

    this.productService.search(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
          this.totalPages = res.totalPages || 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Search failed';
        this.loading = false;
      }
    });
  }

  // 👇 Pagination component se event aayega yahan
  onPageChange(event: { page: number; size: number }) {
    this.currentPage = event.page;
    this.pageSize = event.size;

    // URL update karo
    this.router.navigate([], {
      queryParams: { page: this.currentPage, size: this.pageSize },
      queryParamsHandling: 'merge'  // category param rakhega
    });
  }
}