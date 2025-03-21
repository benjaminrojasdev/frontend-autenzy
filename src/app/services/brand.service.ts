import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private baseUrl = '/api/brand';

  constructor(private http: HttpClient) {}

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
}
