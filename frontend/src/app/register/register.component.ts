import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-header">
        <h2>Create Account</h2>
        <p>Join us today</p>
      </div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Username</label>
          <input type="text" [(ngModel)]="username" name="username" class="form-control" required>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" [(ngModel)]="email" name="email" class="form-control" required>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" class="form-control" required>
        </div>

        <button type="submit" class="btn-primary">Register</button>
      </form>

      <div class="auth-links">
        <p>Already have an account? <a routerLink="/login">Sign In</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  authService = inject(AuthService);
  router = inject(Router);

  onSubmit() {
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Registration failed: ' + err.error.message)
    });
  }
}