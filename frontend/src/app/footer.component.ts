import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
      

        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 ZaidAg. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
     
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {}