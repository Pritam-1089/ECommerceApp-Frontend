import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'https://localhost:7252/api/reviews';

  constructor(private http: HttpClient) {}

  // ✅ GET reviews by product
  getByProduct(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${productId}`);
  }

  // ✅ CREATE review
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // ✅ UPDATE review
  update(reviewId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reviewId}`, data);
  }
  getRating(productId: number) {
  return this.http.get<any>(`${this.apiUrl}/product/${productId}/rating`);
}


}
