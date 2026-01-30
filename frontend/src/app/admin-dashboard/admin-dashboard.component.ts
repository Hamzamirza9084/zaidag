import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Admin Dashboard
          </h1>
          <p class="text-gray-400 mt-2">Manage your user base efficiently</p>
        </div>
        <button (click)="logout()" class="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg transition-all duration-300">
          Logout
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 class="text-gray-400 text-sm font-medium uppercase">Total Users</h3>
          <p class="text-3xl font-bold mt-2">{{ users.length }}</p>
        </div>
      </div>

      <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-black/20 text-gray-400 uppercase text-xs tracking-wider">
                <th class="p-6 font-medium">#</th>
                <th class="p-6 font-medium">Name</th>
                <th class="p-6 font-medium">Email</th>
                <th class="p-6 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let user of users; let i = index" class="hover:bg-white/5 transition-colors">
                <td class="p-6 text-gray-500">{{ i + 1 }}</td>
                <td class="p-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-200">{{ user.name }}</span>
                  </div>
                </td>
                <td class="p-6 text-gray-400">{{ user.email }}</td>
                <td class="p-6 text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400 border border-green-400/20">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="users.length === 0" class="p-12 text-center text-gray-500">
          No users found in the database.
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  users: any[] = [];

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });
  }

  logout() {
    // Add any logout logic here (e.g., clear tokens)
    this.router.navigate(['/admin-login']);
  }
}