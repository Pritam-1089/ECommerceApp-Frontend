import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, CreateAddress } from '../models/address.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = `${environment.apiUrl}/address`;

  constructor(private http: HttpClient) {}
 getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(this.baseUrl);
  }

  getAddressById(id: number): Observable<ApiResponse<Address>> {
    return this.http.get<ApiResponse<Address>>(`${this.baseUrl}/${id}`);
  }

  addAddress(dto: CreateAddress): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(this.baseUrl, dto);
  }

  updateAddress(id: number, dto: CreateAddress): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.baseUrl}/${id}`, dto);
  }

  deleteAddress(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }

  getAddressByPincode(pincode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pincode/${pincode}`, { responseType: 'text' });
  }

}
