import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DotGridComponent } from './dot-grid.component';
import { HeaderComponent } from './header.component'; // Import Header
import { FooterComponent } from './footer.component'; // Import Footer

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    DotGridComponent, 
    HeaderComponent, // Add to imports
    FooterComponent  // Add to imports
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}