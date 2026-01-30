import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DotGridComponent } from './dot-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DotGridComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}