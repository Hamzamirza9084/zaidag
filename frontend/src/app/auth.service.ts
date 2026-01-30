import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/auth'; // Adjust port if needed

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any, isAdminLogin: boolean = false) {
    return this.http.post(`${this.apiUrl}/login`, { ...credentials, isAdminLogin });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}