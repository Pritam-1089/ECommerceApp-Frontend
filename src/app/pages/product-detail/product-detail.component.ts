import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  product: any = null;
  qty = 1;

  loading = true;
  error: string | null = null;


  // ⭐ Review
  rating = 0;
  comment = '';
  reviews: any[] = [];
  hoverRating = 0;
selectedFilter = 0;

  ratingData: any = {
    averageRating: 0,
    totalReviews: 0
  };

  ratingBreakdown: any = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService,
    public authService: AuthService
  ) {}
features: string[] = [];
specs: any = {};
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct(id);
  }

  loadProduct(id: number) {
  this.loading = true;
  this.error = null;

  this.productService.getById(id).subscribe({
    next: (res) => {
      if (res.success) {
        this.product = res.data;

        // ✅ STRING → ARRAY
        if (this.product.description) {
          this.features = this.product.description.split(',').map((f: string) => f.trim());
        }

        // ✅ SMART SPEC DETECT (optional)
        this.extractSpecs();

        this.loadReviews();
        this.loadRating();
      } else {
        this.error = 'Product not found';
      }
      this.loading = false;
    }
  });
}

 loadReviews() {
  if (!this.product) return;

  this.reviewService.getByProduct(this.product.id).subscribe({
    next: (res: any) => {
      console.log('REVIEWS API:', res);

      this.reviews = res.data || [];
      this.processRatings();
    },
    error: (err) => {
      console.error('Reviews error:', err);
      this.reviews = [];
    }
  });
}


 loadRating() {
  if (!this.product) return;

  this.reviewService.getRating(this.product.id).subscribe({
    next: (res: any) => {
      console.log('RATING API:', res);

      this.ratingData = res.data || {
        averageRating: 0,
        totalReviews: 0
      };
    },
    error: (err) => {
      console.error('Rating error:', err);

      this.ratingData = {
        averageRating: 0,
        totalReviews: 0
      };
    }
  });
}


  processRatings() {
    this.ratingBreakdown = {1:0,2:0,3:0,4:0,5:0};

    this.reviews.forEach(r => {
      this.ratingBreakdown[r.rating]++;
    });
  }

  getPercentage(star: number): number {
    const total = this.ratingData?.totalReviews || 0;
    if (total === 0) return 0;
    return (this.ratingBreakdown[star] / total) * 100;
  }

  getCount(star: number): number {
    return this.ratingBreakdown[star] || 0;
  }

  submitReview() {
    if (!this.rating || !this.comment) {
      alert('Please add rating and comment');
      return;
    }

    const payload = {
      productId: this.product.id,
      rating: this.rating,
      comment: this.comment
    };

    this.reviewService.create(payload).subscribe({
  next: () => {
    alert('Review added');

    this.rating = 0;
    this.comment = '';

    this.loadReviews();
    this.loadRating();
  },
  error: (err) => {
    console.log('❌ FULL ERROR:', err);
    console.log('❌ ERROR BODY:', err.error);

    alert('Error: ' + JSON.stringify(err.error));
  }
});

  }
  setHover(star: number) {
  this.hoverRating = star;
}

clearHover() {
  this.hoverRating = 0;
}

setFilter(star: number) {
  this.selectedFilter = star;
}

get filteredReviews() {
  if (this.selectedFilter === 0) return this.reviews;
  return this.reviews.filter(r => r.rating === this.selectedFilter);
}


  addToCart() {
    if (!this.product) return;

    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.qty
    }).subscribe(() => alert('Added to cart'));
  }

  getDiscount(): number {
    if (!this.product?.discountPrice) return 0;
    return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
  }
  testClick() {
  console.log('BUTTON CLICK WORKING');
}
extractSpecs() {
  this.specs = {};

  if (!this.product?.description) return;

  const desc = this.product.description.toLowerCase();

  // RAM detect
  const ramMatch = desc.match(/(\d+gb)\s*ram/);
  if (ramMatch) this.specs['RAM'] = ramMatch[1];

  // Storage detect
  const storageMatch = desc.match(/(\d+gb|\d+tb)/);
  if (storageMatch) this.specs['Storage'] = storageMatch[1];

  // Processor detect
  if (desc.includes('m3')) this.specs['Processor'] = 'Apple M3';
  if (desc.includes('a17')) this.specs['Processor'] = 'A17 Pro';
  if (desc.includes('i7')) this.specs['Processor'] = 'Intel i7';
}
updateReview(reviewId: number) {
  const payload = {
    rating: this.rating,
    comment: this.comment
  };

  this.reviewService.update(reviewId, payload).subscribe({
    next: () => {
      alert('Review updated');

      this.selectedFilter = 0; // 🔥 important
      this.loadReviews();
      this.loadRating();
      setTimeout(() => {
  console.log('UPDATED REVIEWS:', this.reviews);
}, 500);
    }
  });
}

}