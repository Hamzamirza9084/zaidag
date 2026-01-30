import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container" style="border-top: 5px solid #2c3e50;">
      <div class="auth-header">
        <h2 style="color: #2c3e50;">Admin Portal</h2>
        <p>Secure administrative access</p>
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Admin Email</label>
          <input type="email" [(ngModel)]="email" name="email" class="form-control" required>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" class="form-control" required>
        </div>

        <button type="submit" class="btn-primary btn-admin">Login as Admin</button>
      </form>

      <div class="auth-links">
        <p><a routerLink="/login">Back to User Login</a></p>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  email = '';
  password = '';
  authService = inject(AuthService);
  router = inject(Router);

  onSubmit() {
    // Calling login with isAdmin=true
    this.authService.login({ email: this.email, password: this.password }, true).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        
        // Store the token (use 'token' or 'adminToken' depending on your backend auth middleware)
        localStorage.setItem('token', response.token); 
        
        // REDIRECT HERE -> Navigates to the Admin Dashboard
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Admin Login failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}