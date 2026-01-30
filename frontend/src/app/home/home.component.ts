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
    
    <main style="color:white">
      <app-split-text
        [text]="'Hello, you!'"
        [className]="'text-2xl font-semibold text-center'"
        [delay]="50"
        [duration]="1.25"
        [ease]="'power3.out'"
        [splitType]="'chars'"
        [animationFrom]="{ opacity: 0, y: 40 }"
        [animationTo]="{ opacity: 1, y: 0 }"
        [threshold]="0.1"
        [rootMargin]="'-100px'"
        [textAlign]="'center'"
        (letterAnimationComplete)="handleAnimationComplete()">
      </app-split-text>
    </main>

    <app-footer></app-footer>
  `
})
export class HomeComponent {
  handleAnimationComplete() {
    console.log('All letters have animated!');
  }
}