import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private baseUrl = '/api/brand';

  constructor(private http: HttpClient) { }

  getAllBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`).pipe(
      map((brands: any[]) => brands.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getVehiclesByBrand(brandId: number) {
    return this.http.get<any[]>(`/api/api/v1/${brandId}/vehicles`);
  }

  getVehiclesByBrandAndType(brandId: number, typeId: number): Observable<{ typeVehicle: string; models: any[] }> {
    return this.http.get<{ typeVehicle: string; models: any[] }>(`api/api/v1/${brandId}/vehicle/${typeId}`);
  }

  getVersionsByDetailId(idDetail: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/api/v1/versions/${idDetail}`);
  }

  getModelsByBrandId(brandId: number): Observable<any[]> {
      return this.http.get<any[]>(`/api/api/v1/model/brand/${brandId}`);
  }

  getDetailsByModelId(modelId: number): Observable<any[]> {
      return this.http.get<any[]>(`/api/api/v1/details/${modelId}`);
  }

  getFullVersionsByDetailId(idDetail: number): Observable<any[]> {
      return this.http.get<any[]>(`/api/api/v1/versions/full/${idDetail}`);
  }

  postOpinionArtificialIntelligence(prompt: string): Observable<any> {
    return this.http.post<any>(`/api/api/v1/ai/comparator/opinion`, { prompt });
  }

  getTopComparisons(): Observable<any[]> {
    return this.http.get<any[]>(`/api/api/v1/comparisons/top5`);
  }

  postComparison(comparisonData: any): Observable<any> {
  return this.http.post<any>(`/api/api/v1/comparisons/save`, comparisonData);
  }

}