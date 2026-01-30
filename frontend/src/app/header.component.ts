import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="w-full fixed top-0 left-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a routerLink="/" class="text-2xl font-bold tracking-tighter text-white">
          ZAID<span class="text-[#5227FF]">AG</span>
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a routerLink="/" 
             routerLinkActive="text-[#5227FF]" 
             [routerLinkActiveOptions]="{exact: true}"
             class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Home
          </a>
          <a routerLink="/about" 
             routerLinkActive="text-[#5227FF]"
             class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About
          </a>
          <a routerLink="/projects" 
             routerLinkActive="text-[#5227FF]"
             class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Projects
          </a>
        </nav>

        <a routerLink="/contact" class="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white transition-colors bg-white/10 border border-white/10 rounded-full hover:bg-white/20 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5227FF]">
          Contact Me
        </a>

        <button class="md:hidden text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      
      <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {}