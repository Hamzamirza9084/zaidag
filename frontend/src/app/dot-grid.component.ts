import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
}

@Component({
  selector: 'app-dot-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #wrapper class="w-full h-full relative overflow-hidden">
      <canvas #canvas class="block w-full h-full"></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;       /* 1. Fix position to the viewport */
      top: 0;
      left: 0;
      width: 100vw;          /* 2. Full viewport width */
      height: 100vh;         /* 3. Full viewport height */
      z-index: -1;           /* 4. Send behind other content */
      background-color: black; /* 5. Set background to black */
      overflow: hidden;
    }
  `]
})
export class DotGridComponent implements AfterViewInit, OnDestroy {
  // Default dot color set to a bright grey so it is visible on black
  @Input() baseColor = '#444'; 
  @Input() activeColor = '#5227FF'; 
  @Input() dotSize = 16;
  @Input() gap = 32;
  @Input() proximity = 150;
  @Input() speedTrigger = 100;
  @Input() shockRadius = 250;
  @Input() shockStrength = 5;
  @Input() maxSpeed = 5000;
  @Input() returnDuration = 1.5;
  @Input() className = '';
  @Input() style: { [klass: string]: any } = {};

  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private dots: Dot[] = [];
  private pointer = { x: 0, y: 0, lastTime: 0, lastX: 0, lastY: 0 };
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mouseMoveHandler: any;
  private clickHandler: any;
  private resizeHandler: any;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      this.initGrid();
      this.startAnimation();
      this.initEvents();
    });
  }

  private hexToRgb(hex: string) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16)
    };
  }

  private getCirclePath(): Path2D | null {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, this.dotSize / 2, 0, Math.PI * 2);
    return p;
  }

  private buildGrid = () => {
    const wrap = this.wrapperRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + this.gap) / (this.dotSize + this.gap));
    const rows = Math.floor((height + this.gap) / (this.dotSize + this.gap));
    const cell = this.dotSize + this.gap;

    const gridW = cell * cols - this.gap;
    const gridH = cell * rows - this.gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + this.dotSize / 2;
    const startY = extraY / 2 + this.dotSize / 2;

    this.dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        this.dots.push({ cx, cy, xOffset: 0, yOffset: 0 });
      }
    }
  };

  private initGrid() {
    this.buildGrid();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.buildGrid());
      this.resizeObserver.observe(this.wrapperRef.nativeElement);
    } else {
      this.resizeHandler = () => this.buildGrid();
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  private startAnimation() {
    const circlePath = this.getCirclePath();
    if (!circlePath) return;

    const baseRgb = this.hexToRgb(this.baseColor);
    const activeRgb = this.hexToRgb(this.activeColor);
    const proxSq = this.proximity * this.proximity;

    const draw = () => {
      const canvas = this.canvasRef.nativeElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear the canvas. Note: The black background comes from the CSS, not this clear.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: px, y: py } = this.pointer;

      for (const dot of this.dots) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let style = this.baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / this.proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      this.rafId = requestAnimationFrame(draw);
    };

    draw();
  }

  private initEvents() {
    const throttle = (func: (...args: any[]) => void, limit: number) => {
      let lastCall = 0;
      return (...args: any[]) => {
        const now = performance.now();
        if (now - lastCall >= limit) {
          lastCall = now;
          func.apply(this, args);
        }
      };
    };

    const onMove = (e: MouseEvent) => {
      const pr = this.pointer;
      const now = performance.now();
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      const speed = Math.hypot(vx, vy);

      if (speed > this.maxSpeed) {
        const scale = this.maxSpeed / speed;
        vx *= scale;
        vy *= scale;
      }

      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.x = e.clientX; 
      pr.y = e.clientY;

      for (const dot of this.dots) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > this.speedTrigger && dist < this.proximity) {
          const pushX = (dot.cx - pr.x) * 0.1 + vx * 0.002;
          const pushY = (dot.cy - pr.y) * 0.1 + vy * 0.002;

          gsap.killTweensOf(dot);
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.2,
            ease: 'power1.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: this.returnDuration,
                ease: 'elastic.out(1,0.75)'
              });
            }
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      for (const dot of this.dots) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < this.shockRadius) {
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / this.shockRadius);
          const pushX = (dot.cx - cx) * this.shockStrength * falloff;
          const pushY = (dot.cy - cy) * this.shockStrength * falloff;
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: this.returnDuration,
                ease: 'elastic.out(1,0.75)'
              });
            }
          });
        }
      }
    };

    this.mouseMoveHandler = throttle(onMove, 30);
    this.clickHandler = onClick;
    window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
    window.addEventListener('click', this.clickHandler);
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.mouseMoveHandler) window.removeEventListener('mousemove', this.mouseMoveHandler);
    if (this.clickHandler) window.removeEventListener('click', this.clickHandler);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}