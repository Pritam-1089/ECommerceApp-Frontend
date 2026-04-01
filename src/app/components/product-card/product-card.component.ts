import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService, public authService: AuthService) {}

  addToCart() {
    this.cartService.addToCart({ productId: this.product.id, quantity: 1 }).subscribe();
  }

  onImageError(event: any) {
  event.target.src = 'assets/no-image.png';
}

}
