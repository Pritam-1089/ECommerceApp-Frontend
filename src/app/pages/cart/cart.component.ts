import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { LoaderComponent } from '../../shared/loader/loader.component'; // ✅ ADD

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent], // ✅ ADD
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cart: Cart | null = null;

  loading = true;
  error: string | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  // ✅ Load Cart Properly
  loadCart() {
  this.loading = true;
  this.error = null;

  this.cartService.cart$.subscribe({
    next: (cart) => {
      console.log('CART DATA:', cart);

      this.cart = cart;
      this.loading = false; // ✅ FIX
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load cart';

      this.loading = false; // ✅ FIX
    }
  });

  this.cartService.loadCart();
}

  // ✅ Update Quantity
  updateQty(itemId: number, qty: number) {
    this.loading = true;

    this.cartService.updateItem(itemId, qty).subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  // ✅ Remove Item
  remove(itemId: number) {
    this.loading = true;

    this.cartService.removeItem(itemId).subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  // ✅ Clear Cart
  clearAll() {
    this.loading = true;

    this.cartService.clearCart().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }
}
