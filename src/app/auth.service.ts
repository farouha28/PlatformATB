import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // URL de votre backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username: email, password: password });
  }

  register(username: string, email: string, password: string, confirmpassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password, confirmpassword });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
