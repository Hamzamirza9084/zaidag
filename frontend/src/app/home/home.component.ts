import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header.component';
import { FooterComponent } from '../footer.component';
import { SplitTextComponent } from '../split-text.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SplitTextComponent],
  template: `
    <app-header></app-header>
    
    <main>
      <app-split-text></app-split-text>
      </main>

    <app-footer></app-footer>
  `
})
export class HomeComponent {}