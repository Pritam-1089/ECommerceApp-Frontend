import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Cart, AddToCart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'https://localhost:7252/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCart(): void {
    this.getCart().subscribe(res => {
      if (res.success) this.cartSubject.next(res.data);
    });
  }

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl);
  }

  addToCart(dto: AddToCart): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/items`, dto)
      .pipe(tap(res => { if (res.success) this.cartSubject.next(res.data); }));
  }

  updateItem(cartItemId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${this.apiUrl}/items/${cartItemId}`, quantity)
      .pipe(tap(res => { if (res.success) this.cartSubject.next(res.data); }));
  }

  removeItem(cartItemId: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/items/${cartItemId}`)
      .pipe(tap(() => this.loadCart()));
  }

  clearCart(): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(this.apiUrl)
      .pipe(tap(() => this.cartSubject.next(null)));
  }

  getCartItemCount(): number {
    return this.cartSubject.value?.items?.length ?? 0;
  }
}
