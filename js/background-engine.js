/* ==========================================================
   RETRO-DEV-PORTFOLIO // RETRO BACKGROUND ENGINE
   Lightweight canvas dispatcher coordinating theme backgrounds:
   - theme-atari: js/backgrounds/atari.js
   - theme-green-crt: js/backgrounds/matrix.js
   - theme-obsidian: js/backgrounds/dvd.js
   - theme-cyberpunk: js/backgrounds/cyberpunk.js
   - theme-amber: js/backgrounds/amber.js
   - theme-win98: js/backgrounds/win98-pipes.js
   - theme-virtualboy: js/backgrounds/virtualboy.js
   ========================================================== */

class RetroBackgroundEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.currentTheme = 'theme-atari';
    this.time = 0;

    this.init();
  }

  init() {
    const start = () => {
      this.canvas = document.getElementById('bg-canvas') || document.getElementById('bg-dvd-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Read active theme from DOM
      this.currentTheme = this.detectCurrentTheme();
      this.initCurrentTheme();

      // Listen for theme selector change
      const themeSelect = document.getElementById('theme-selector');
      if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
          this.setTheme(e.target.value);
        });
      }

      window.addEventListener('themechange', (e) => {
        if (e.detail && e.detail.theme) {
          this.setTheme(e.detail.theme);
        }
      });

      this.loop();
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
    if (!newTheme) return;
    this.currentTheme = newTheme;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    this.initCurrentTheme();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    const bg = this.getActiveBackground();
    if (bg) {
      if (typeof bg.resize === 'function') {
        bg.resize(this.width, this.height);
      } else if (typeof bg.init === 'function') {
        bg.init(this.width, this.height);
      }
    }
  }

  loop = () => {
    this.time += 0.02;
    if (this.ctx && this.canvas) {
      const bg = this.getActiveBackground();
      if (bg && typeof bg.render === 'function') {
        bg.render(this.ctx, this.width, this.height, this.time);
      }
    }
    this.animId = requestAnimationFrame(this.loop);
  };
}

// Global instance & backward compatibility
window.bgEngine = new RetroBackgroundEngine();
window.bgDvd = window.bgEngine;
