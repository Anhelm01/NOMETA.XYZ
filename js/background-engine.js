/* ==========================================================
   RETRO-DEV-PORTFOLIO // RETRO BACKGROUND ENGINE (v2.0)
   - High DPI / Retina support (crisp on 4K & mobile screens)
   - Tab visibilitychange awareness (auto-pause on hidden tab)
   - Mobile 30 FPS throttling for battery & thermal efficiency
   - Throttled window resize with RAF
   - System prefers-reduced-motion support
   ========================================================== */

class RetroBackgroundEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.animId = null;
    this.currentTheme = 'theme-atari';
    this.time = 0;
    this.lastFrameTime = 0;
    this.resizeRaf = null;
    this.isPaused = false;
    this.reducedMotion = false;

    this.init();
  }

  init() {
    const start = () => {
      this.canvas = document.getElementById('bg-canvas') || document.getElementById('bg-dvd-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      // Check user motion preferences
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = motionQuery.matches;
      motionQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        if (!this.reducedMotion && !this.isPaused) {
          this.loop(performance.now());
        }
      });

      this.resize();

      // Throttled window resize
      window.addEventListener('resize', () => {
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
        this.resizeRaf = requestAnimationFrame(() => this.resize());
      });

      // Pause loop when browser tab is inactive to save battery and CPU
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isPaused = true;
          if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
          }
        } else {
          this.isPaused = false;
          this.lastFrameTime = performance.now();
          this.loop(this.lastFrameTime);
        }
      });

      // Read active theme from DOM
      this.currentTheme = this.detectCurrentTheme();
      this.initCurrentTheme();

      // Listen for custom theme change events
      window.addEventListener('themechange', (e) => {
        if (e.detail && e.detail.theme) {
          this.setTheme(e.detail.theme);
        }
      });

      this.lastFrameTime = performance.now();
      this.loop(this.lastFrameTime);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  detectCurrentTheme() {
    const cl = document.body.className || '';
    if (cl.includes('theme-green-crt')) return 'theme-green-crt';
    if (cl.includes('theme-atari')) return 'theme-atari';
    if (cl.includes('theme-cyberpunk')) return 'theme-cyberpunk';
    if (cl.includes('theme-amber')) return 'theme-amber';
    if (cl.includes('theme-win98')) return 'theme-win98';
    if (cl.includes('theme-virtualboy')) return 'theme-virtualboy';
    if (cl.includes('theme-obsidian')) return 'theme-obsidian';
    const sel = document.getElementById('theme-selector');
    return (sel && sel.value) ? sel.value : 'theme-atari';
  }

  getActiveBackground() {
    const registry = window.RetroBackgrounds || {};
    return registry[this.currentTheme] || registry['theme-atari'] || null;
  }

  initCurrentTheme() {
    const bg = this.getActiveBackground();
    if (bg && typeof bg.init === 'function') {
      bg.init(this.width, this.height);
    }
  }

  setTheme(newTheme) {
    if (!newTheme || newTheme === this.currentTheme && this.ctx) return;
    this.currentTheme = newTheme;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    this.initCurrentTheme();
    if (this.reducedMotion && this.ctx) {
      const bg = this.getActiveBackground();
      if (bg && typeof bg.render === 'function') {
        bg.render(this.ctx, this.width, this.height, this.time);
      }
    }
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Retina HiDPI scale (capped at 2 for performance)
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const bg = this.getActiveBackground();
    if (bg) {
      if (typeof bg.resize === 'function') {
        bg.resize(this.width, this.height);
      } else if (typeof bg.init === 'function') {
        bg.init(this.width, this.height);
      }
    }
  }

  loop = (now = performance.now()) => {
    if (this.isPaused) return;

    // On mobile devices (<=768px), throttle canvas to ~30 FPS to prevent battery drain
    const isMobile = this.width <= 768;
    const targetInterval = isMobile ? 32 : 16; // ~30 FPS on mobile, ~60 FPS on desktop
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= targetInterval) {
      this.lastFrameTime = now - (elapsed % targetInterval);
      this.time += 0.02;

      if (this.ctx && this.canvas) {
        const bg = this.getActiveBackground();
        if (bg && typeof bg.render === 'function') {
          bg.render(this.ctx, this.width, this.height, this.time);
        }
      }
    }

    // If reduced motion is requested, render one still frame and stop
    if (this.reducedMotion) {
      return;
    }

    this.animId = requestAnimationFrame(this.loop);
  };
}

// Global instance & backward compatibility
window.bgEngine = new RetroBackgroundEngine();
window.bgDvd = window.bgEngine;
