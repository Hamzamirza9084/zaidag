import { Component, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChildren, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-split-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="className" [style.textAlign]="textAlign" #textContainer>
      <span 
        *ngFor="let char of characters; let i = index"
        #charSpan
        style="display: inline-block; white-space: pre;"
        [style.opacity]="animationFrom.opacity"
        [style.transform]="'translateY(' + animationFrom.y + 'px)'">
        {{ char }}
      </span>
    </div>
  `
})
export class SplitTextComponent implements AfterViewInit, OnDestroy {
  @Input() text: string = '';
  @Input() className: string = '';
  @Input() delay: number = 50; // default from your snippet
  @Input() duration: number = 1.25;
  @Input() ease: string = 'power3.out';
  @Input() splitType: 'chars' | 'words' = 'chars'; // currently handles chars
  @Input() animationFrom: any = { opacity: 0, y: 40 };
  @Input() animationTo: any = { opacity: 1, y: 0 };
  @Input() threshold: number = 0.1;
  @Input() rootMargin: string = '-100px';
  @Input() textAlign: string = 'center';
  
  @Output() letterAnimationComplete = new EventEmitter<void>();

  @ViewChildren('charSpan') charSpans!: QueryList<ElementRef>;
  @ViewChildren('textContainer') container!: ElementRef;

  public characters: string[] = [];
  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private el: ElementRef) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.characters = this.text.split('');
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animate();
          this.observer?.disconnect(); // Trigger once
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  animate() {
    const elements = this.charSpans.map(s => s.nativeElement);
    
    gsap.to(elements, {
      opacity: this.animationTo.opacity,
      y: this.animationTo.y,
      duration: this.duration,
      ease: this.ease,
      stagger: this.delay / 1000, // Convert ms to seconds for GSAP
      onComplete: () => {
        this.letterAnimationComplete.emit();
      }
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}