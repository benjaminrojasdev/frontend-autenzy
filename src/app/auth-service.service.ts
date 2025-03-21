import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  private apiUrl = '/api/auth/login';

  constructor(private http: HttpClient) { }

  login() {
    const credentials = {
      username: 'admin',
      password: 'admin123'
    };

    return this.http.post<{ token: string }>(this.apiUrl, credentials);
  }
}
