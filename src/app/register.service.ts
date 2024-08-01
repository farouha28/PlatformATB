import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:5000/auth/register';

  constructor(private http: HttpClient) {}

  register(user: { username: string; password: string; confirmpassword: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}
