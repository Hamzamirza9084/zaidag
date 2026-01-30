import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default path shows Header/Footer/Gallery
  { path: 'login', component: LoginComponent }, // Login path shows ONLY Login form + Background
  { path: 'register', component: RegisterComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: '**', redirectTo: '' } // Redirect unknown paths to home
];