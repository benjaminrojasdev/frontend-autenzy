import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private baseUrl = '/api/v1/contact';

  constructor(private http: HttpClient) { }

  sendEmail(payload: any, options = {}): Observable<any> {
    return this.http.post(`api/${this.baseUrl}/send-email`, payload, options);
  }
}
