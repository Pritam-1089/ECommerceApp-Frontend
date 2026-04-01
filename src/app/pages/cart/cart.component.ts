import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.loadCart();
  }

  updateQty(itemId: number, qty: number) {
    this.cartService.updateItem(itemId, qty).subscribe();
  }

  remove(itemId: number) {
    this.cartService.removeItem(itemId).subscribe();
  }

  clearAll() {
    this.cartService.clearCart().subscribe();
  }
}
