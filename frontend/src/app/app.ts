import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DotGridComponent } from './dot-grid.component';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { SplitTextComponent } from './split-text.component'; // Import here

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    DotGridComponent, 
    HeaderComponent, 
    FooterComponent,
    SplitTextComponent // Add to imports
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}