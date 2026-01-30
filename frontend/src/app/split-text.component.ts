import { Component, ElementRef, Input, AfterViewInit, ViewChildren, QueryList, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-split-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="className" [ngStyle]="{'text-align': textAlign}">
      <span 
        *ngFor="let word of splitWords; let i = index" 
        class="inline-block whitespace-nowrap overflow-hidden align-top mr-[0.25em]">
        
        <span 
          *ngFor="let char of word.chars" 
          #animChar
          class="inline-block will-change-transform opacity-0 translate-y-[40px]">
          {{ char }}
        </span>
      </span>
    </p>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SplitTextComponent implements AfterViewInit, OnDestroy {
  @Input() text: string = '';
  @Input() className: string = '';
  @Input() delay: number = 0;
  @Input() duration: number = 1; // Seconds
  @Input() textAlign: string = 'center';

  @ViewChildren('animChar') charElements!: QueryList<ElementRef>;

  splitWords: { text: string, chars: string[] }[] = [];
  private ctx: any; // GSAP Context for cleanup

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.splitText();
  }

  ngOnChanges() {
    this.splitText();
  }

  private splitText() {
    if (!this.text) return;
    this.splitWords = this.text.split(' ').map(word => ({
      text: word,
      chars: word.split('')
    }));
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Use GSAP Context for easy cleanup
    this.ctx = gsap.context(() => {
      const chars = this.charElements.map(el => el.nativeElement);

      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: this.duration,
        ease: 'power3.out',
        stagger: 0.02,
        delay: this.delay / 1000,
        scrollTrigger: {
          trigger: chars[0], // Trigger when first char enters view
          start: 'top 100%',  // Start when top of text hits 80% of viewport height
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.ctx) this.ctx.revert();
  }
}