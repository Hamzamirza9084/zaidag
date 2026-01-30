import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-header">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" [(ngModel)]="email" name="email" class="form-control" required placeholder="john@example.com">
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" class="form-control" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn-primary">Sign In</button>
      </form>

      <div class="auth-links">
        <p>Don't have an account? <a routerLink="/register">Register</a></p>
        <p style="margin-top: 10px;"><a routerLink="/admin-login" style="color: #666;">Admin Access</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  authService = inject(AuthService);
  router = inject(Router);

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']); // Redirect to home/dashboard
      },
      error: (err) => alert('Login failed: ' + err.error.message)
    });
  }
}