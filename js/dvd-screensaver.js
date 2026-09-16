/* ==========================================================
   RETRO-DEV-PORTFOLIO // MULTI-THEME BACKGROUND CANVAS FX
   Dynamically adapts animation to match current active theme:
   - theme-atari: 3D synthwave horizon grid + retro sunset sun + stars
   - theme-green-crt: Matrix P1 phosphor digital code rain
   - theme-obsidian: Bouncing neon DVD Video logo + cyber dust
   - theme-cyberpunk: Hyperspace 3D warp speed tunnel + neon streaks
   - theme-amber: Vintage amber oscilloscope waves + radar sonar sweep
   - theme-win98: Windows 95/98 "Mystify Your Mind" bouncing vector ribbons
   - theme-virtualboy: 3D rotating red wireframe cube & tunnel
   Runs at 60fps, 100% silent, responsive, lightweight 2D canvas.
   ========================================================== */

class RetroBackgroundEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.currentTheme = 'theme-atari'; // Default theme

    // Common time tracker
    this.time = 0;

    // 1. ATARI VCS: Synthwave Horizon Grid & Striped Sun
    this.atari = {
      gridOffset: 0,
      stars: []
    };

    // 2. GREEN CRT: Matrix Code Rain
    this.matrix = {
      drops: [],
      chars: 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF:・."=*+-<>¦|',
      fontSize: 15,
      columns: 0
    };

    // 3. OBSIDIAN: Bouncing DVD Logo + Dust
    this.dvd = {
      img: new Image(),
      imgLoaded: false,
      x: 80,
      y: 80,
      vx: 2.2,
      vy: 1.7,
      width: 160,
      height: 86,
      colors: ['#a855f7', '#00f0ff', '#00ff66', '#facc15', '#f43f5e', '#38bdf8'],
      colorIndex: 0,
      dust: []
    };

    // 4. CYBERPUNK 2099: Neo-Tokyo Blade Runner Skyline & Neon Rain
    this.cyberpunk = {
      skyline: [],
      rain: [],
      searchlightAngle: 0
    };

    // 5. AMBER: 1983 WOPR / NORAD 3D Wireframe Vector Globe & Telemetry
    this.amber = {
      rotY: 0,
      rotX: 0.38,
      satelliteAngle: 0
    };

    // 6. WIN98: Iconic Windows 98 3D Pipes Screensaver
    this.win98 = {
      pipes: [],
      radius: 10,
      maxPipes: 4
    };

    // 7. VIRTUAL BOY: 3D Rotating Wireframe Cube
    this.virtualboy = {
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      tunnels: []
    };

    this.init();
  }

  init() {
    this.dvd.img.src = 'assets/images/dvd-video.png';
    this.dvd.img.onload = () => {
      this.dvd.imgLoaded = true;
    };

    const start = () => {
      this.canvas = document.getElementById('bg-dvd-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Read active theme from DOM
      this.currentTheme = this.detectCurrentTheme();
      this.initTheme(this.currentTheme);

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

  setTheme(newTheme) {
    if (!newTheme) return;
    this.currentTheme = newTheme;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    this.initTheme(newTheme);
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.initTheme(this.currentTheme);
  }

  initTheme(theme) {
    const W = this.width || window.innerWidth;
    const H = this.height || window.innerHeight;

    switch (theme) {
      case 'theme-atari':
        this.atari.stars = [];
        for (let i = 0; i < 50; i++) {
          this.atari.stars.push({
            x: Math.random() * W,
            y: Math.random() * (H * 0.58),
            size: Math.random() > 0.85 ? 3 : (Math.random() > 0.5 ? 2 : 1),
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.04
          });
        }
        break;

      case 'theme-green-crt':
        this.matrix.columns = Math.floor(W / this.matrix.fontSize);
        this.matrix.drops = [];
        for (let c = 0; c < this.matrix.columns; c++) {
          this.matrix.drops.push({
            y: Math.floor(Math.random() * -H),
            speed: 2 + Math.random() * 3.5,
            length: Math.floor(12 + Math.random() * 18),
            chars: []
          });
        }
        break;

      case 'theme-obsidian':
        this.dvd.x = Math.floor(Math.random() * Math.max(20, W - this.dvd.width - 40)) + 20;
        this.dvd.y = Math.floor(Math.random() * Math.max(20, H - this.dvd.height - 40)) + 20;
        this.dvd.vx = (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 0.7);
        this.dvd.vy = (Math.random() > 0.5 ? 1 : -1) * (1.4 + Math.random() * 0.7);
        this.dvd.dust = [];
        for (let i = 0; i < 35; i++) {
          this.dvd.dust.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 2 + 0.8,
            speedY: -(0.3 + Math.random() * 0.6),
            swaySpeed: 0.02 + Math.random() * 0.03,
            swayAmp: Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.2 + Math.random() * 0.4
          });
        }
        break;

      case 'theme-cyberpunk':
        // Generate Neo-Tokyo skyline
        this.cyberpunk.skyline = [];
        let curX = -40;
        while (curX < W + 80) {
          const bW = Math.floor(Math.random() * 65 + 40);
          const bH = Math.floor(Math.random() * (H * 0.42) + (H * 0.18));
          const hasAntenna = Math.random() > 0.45;
          const antennaH = Math.floor(Math.random() * 45 + 20);

          // Generate matrix of windows
          const windows = [];
          const rows = Math.floor(bH / 16);
          const cols = Math.floor(bW / 14);
          for (let r = 2; r < rows - 1; r++) {
            for (let c = 1; c < cols - 1; c++) {
              if (Math.random() > 0.65) {
                windows.push({
                  rx: c * 14,
                  ry: r * 16,
                  color: Math.random() > 0.5 ? '#00f0ff' : '#fef08a',
                  flicker: Math.random() * Math.PI * 2
                });
              }
            }
          }

          this.cyberpunk.skyline.push({
            x: curX,
            w: bW,
            h: bH,
            hasAntenna,
            antennaH,
            windows,
            edgeColor: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.28)' : 'rgba(217, 70, 239, 0.28)'
          });

          curX += bW - 4; // slight overlap
        }

        // Generate neon rain
        this.cyberpunk.rain = [];
        for (let i = 0; i < 70; i++) {
          this.cyberpunk.rain.push({
            x: Math.random() * (W + 100) - 50,
            y: Math.random() * H,
            speed: 13 + Math.random() * 8,
            len: 20 + Math.random() * 25,
            color: Math.random() > 0.45 ? '#00f0ff' : '#ff007f',
            alpha: 0.3 + Math.random() * 0.4
          });
        }
        break;

      case 'theme-amber':
        this.amber.rotY = 0;
        this.amber.satelliteAngle = 0;
        break;

      case 'theme-win98':
        // Initialize 4 Windows 98 3D Pipes
        const palettes = [
          { highlight: '#ffffff', mid: '#c0c0c0', shadow: '#383838' }, // Chrome Silver
          { highlight: '#93c5fd', mid: '#000080', shadow: '#000028' }, // Windows Blue
          { highlight: '#fef08a', mid: '#ca8a04', shadow: '#582c06' }, // Brass Gold
          { highlight: '#67e8f9', mid: '#0f766e', shadow: '#042f2e' }  // Desktop Teal Copper
        ];

        this.win98.pipes = [];
        for (let i = 0; i < 4; i++) {
          const startX = Math.floor(Math.random() * (W - 200) + 100);
          const startY = Math.floor(Math.random() * (H - 200) + 100);
          const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
          const dir = dirs[i % dirs.length];

          this.win98.pipes.push({
            x: startX,
            y: startY,
            headX: startX,
            headY: startY,
            dir: dir,
            palette: palettes[i],
            segments: [],
            joints: [{ x: startX, y: startY }],
            distance: 0,
            maxDistance: Math.floor(Math.random() * 60 + 45)
          });
        }
        break;

      case 'theme-virtualboy':
        this.virtualboy.rotX = 0;
        this.virtualboy.rotY = 0;
        this.virtualboy.rotZ = 0;
        this.virtualboy.tunnels = [
          { z: 100 },
          { z: 300 },
          { z: 500 },
          { z: 700 }
        ];
        break;
    }
  }

  loop = () => {
    this.time += 0.02;
    if (this.ctx && this.canvas) {
      this.render();
    }
    this.animId = requestAnimationFrame(this.loop);
  };

  render() {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;

    switch (this.currentTheme) {
      case 'theme-atari':
        this.renderAtari(ctx, W, H);
        break;
      case 'theme-green-crt':
        this.renderMatrix(ctx, W, H);
        break;
      case 'theme-obsidian':
        this.renderObsidianDvd(ctx, W, H);
        break;
      case 'theme-cyberpunk':
        this.renderCyberpunk(ctx, W, H);
        break;
      case 'theme-amber':
        this.renderAmber(ctx, W, H);
        break;
      case 'theme-win98':
        this.renderWin98(ctx, W, H);
        break;
      case 'theme-virtualboy':
        this.renderVirtualBoy(ctx, W, H);
        break;
      default:
        this.renderAtari(ctx, W, H);
        break;
    }
  }

  /* ==========================================================
     1. ATARI VCS: RETRO SYNTHWAVE HORIZON GRID & RETRO SUN
     ========================================================== */
  renderAtari(ctx, W, H) {
    ctx.clearRect(0, 0, W, H);

    const horizY = H * 0.58;
    const vpX = W * 0.5;

    // 1. Vector stars in upper sky
    ctx.save();
    for (let s of this.atari.stars) {
      s.phase += s.speed;
      const alpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      if (s.size > 2) {
        // Cross pixel star
        ctx.fillRect(s.x - 1, s.y, 3, 1);
        ctx.fillRect(s.x, s.y - 1, 1, 3);
      } else {
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
    }
    ctx.restore();

    // 2. Retro Striped Sun on horizon
    const sunR = Math.min(W, H) * 0.16;
    const sunX = vpX;
    const sunY = horizY - 24;

    ctx.save();
    // Radiant Sun Outer Glow
    const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, sunR * 1.5);
    sunGlow.addColorStop(0, 'rgba(234, 88, 12, 0.45)');
    sunGlow.addColorStop(0.7, 'rgba(239, 68, 68, 0.15)');
    sunGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Sun Disc with Gradient
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, Math.PI, 0, false); // top half
    ctx.arc(sunX, sunY, sunR, 0, Math.PI, false); // full circle
    const sunGrad = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
    sunGrad.addColorStop(0, '#fef08a'); // yellow top
    sunGrad.addColorStop(0.45, '#ea580c'); // fiery orange
    sunGrad.addColorStop(1, '#b91c1c'); // red base
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // Classic 80s horizontal slice bars across lower half of sun
    ctx.fillStyle = '#0a0a0a'; // match dark background
    const barStart = sunY - sunR * 0.15;
    const barCount = 7;
    for (let i = 0; i < barCount; i++) {
      const barY = barStart + (i / barCount) * (sunR * 1.15);
      const barH = 2 + Math.pow(i / barCount, 1.4) * 5;
      ctx.fillRect(sunX - sunR - 10, barY, (sunR + 10) * 2, barH);
    }
    ctx.restore();

    // 3. Horizon Glow Line
    ctx.save();
    const horizGrad = ctx.createLinearGradient(0, horizY, W, horizY);
    horizGrad.addColorStop(0, 'transparent');
    horizGrad.addColorStop(0.2, '#ea580c');
    horizGrad.addColorStop(0.5, '#facc15');
    horizGrad.addColorStop(0.8, '#ea580c');
    horizGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = horizGrad;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(0, horizY);
    ctx.lineTo(W, horizY);
    ctx.stroke();
    ctx.restore();

    // 4. Perspective Grid (Floor)
    ctx.save();
    this.atari.gridOffset = (this.atari.gridOffset + 0.007) % 1;

    // Transverse lines (horizontal lines moving forward)
    const lineCount = 15;
    for (let i = 0; i < lineCount; i++) {
      const progress = (i + this.atari.gridOffset) / lineCount;
      const y = horizY + Math.pow(progress, 2.7) * (H - horizY);
      const alpha = 0.12 + Math.pow(progress, 1.5) * 0.65;
      const lw = 0.8 + progress * 2.2;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    // Longitudinal lines (radiating from vanishing point)
    const rays = 18;
    for (let i = 0; i <= rays; i++) {
      const bottomX = (i / rays) * W * 1.5 - W * 0.25;
      ctx.beginPath();
      ctx.moveTo(vpX, horizY);
      ctx.lineTo(bottomX, H);
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.32)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ==========================================================
     2. GREEN CRT: MATRIX P1 PHOSPHOR DIGITAL CODE RAIN
     ========================================================== */
  renderMatrix(ctx, W, H) {
    // Phosphor persistence decay
    ctx.fillStyle = 'rgba(2, 11, 5, 0.18)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${this.matrix.fontSize}px "JetBrains Mono", monospace`;

    const drops = this.matrix.drops;
    const chars = this.matrix.chars;
    const fs = this.matrix.fontSize;

    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      const x = i * fs;

      // Make sure character buffer is filled
      while (drop.chars.length < drop.length) {
        drop.chars.push(chars[Math.floor(Math.random() * chars.length)]);
      }

      // Randomly glitch / mutate chars
      if (Math.random() > 0.96) {
        const randIdx = Math.floor(Math.random() * drop.chars.length);
        drop.chars[randIdx] = chars[Math.floor(Math.random() * chars.length)];
      }

      // Draw each glyph in the drop column
      for (let j = 0; j < drop.length; j++) {
        const y = drop.y - j * fs;
        if (y < 0 || y > H) continue;

        const char = drop.chars[j] || '0';

        if (j === 0) {
          // Head character: bright glowing white/phosphor
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00ff66';
          ctx.shadowBlur = 10;
          ctx.fillText(char, x, y);
          ctx.restore();
        } else if (j < 3) {
          ctx.fillStyle = '#00ff66';
          ctx.fillText(char, x, y);
        } else {
          const fade = 1 - j / drop.length;
          ctx.fillStyle = `rgba(16, 185, 129, ${fade * 0.75})`;
          ctx.fillText(char, x, y);
        }
      }

      // Move drop downward
      drop.y += drop.speed;

      // Reset when drop falls off bottom
      if (drop.y - drop.length * fs > H) {
        drop.y = Math.floor(Math.random() * -80);
        drop.speed = 2 + Math.random() * 3.5;
        drop.length = Math.floor(12 + Math.random() * 18);
        drop.chars = [];
      }
    }
  }

  /* ==========================================================
     3. OBSIDIAN PURPLE: BOUNCING DVD VIDEO + CYBER DUST
     ========================================================== */
  renderObsidianDvd(ctx, W, H) {
    ctx.clearRect(0, 0, W, H);

    // 1. Ambient Cyber Dust particles
    ctx.save();
    for (let p of this.dvd.dust) {
      p.y += p.speedY;
      p.phase += p.swaySpeed;
      p.x += Math.sin(p.phase) * p.swayAmp;

      if (p.y < 0) {
        p.y = H + 10;
        p.x = Math.random() * W;
      }

      ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Bouncing DVD Logo Physics
    const dvd = this.dvd;
    dvd.x += dvd.vx;
    dvd.y += dvd.vy;

    let hit = false;
    if (dvd.x + dvd.width >= W) {
      dvd.x = W - dvd.width;
      dvd.vx = -Math.abs(dvd.vx);
      hit = true;
    } else if (dvd.x <= 0) {
      dvd.x = 0;
      dvd.vx = Math.abs(dvd.vx);
      hit = true;
    }

    if (dvd.y + dvd.height >= H) {
      dvd.y = H - dvd.height;
      dvd.vy = -Math.abs(dvd.vy);
      hit = true;
    } else if (dvd.y <= 0) {
      dvd.y = 0;
      dvd.vy = Math.abs(dvd.vy);
      hit = true;
    }

    if (hit) {
      dvd.colorIndex = (dvd.colorIndex + 1) % dvd.colors.length;
    }

    if (!dvd.imgLoaded) return;

    // Render DVD Logo
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.shadowColor = dvd.colors[dvd.colorIndex];
    ctx.shadowBlur = 24;
    ctx.drawImage(dvd.img, dvd.x, dvd.y, dvd.width, dvd.height);

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = dvd.colors[dvd.colorIndex];
    ctx.fillRect(dvd.x, dvd.y, dvd.width, dvd.height);

    // Subtle scanlines across DVD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    for (let s = dvd.y; s < dvd.y + dvd.height; s += 3) {
      ctx.fillRect(dvd.x, s, dvd.width, 1.2);
    }
    ctx.restore();
  }

  /* ==========================================================
     4. CYBERPUNK 2099: NEO-TOKYO SKYLINE & VERTICAL NEON ACID RAIN
     ========================================================== */
  renderCyberpunk(ctx, W, H) {
    // 1. Dark atmospheric night sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#040714');
    skyGrad.addColorStop(0.55, '#091026');
    skyGrad.addColorStop(1, '#140c24');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Distant Horizon Neon Haze
    const horizonY = H * 0.75;
    ctx.save();
    const haze = ctx.createRadialGradient(W * 0.5, horizonY, 50, W * 0.5, horizonY, W * 0.7);
    haze.addColorStop(0, 'rgba(217, 70, 239, 0.16)'); // magenta haze
    haze.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');  // cyan glow
    haze.addColorStop(1, 'transparent');
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizonY - H * 0.4, W, H * 0.5);
    ctx.restore();

    // 3. Sweeping Police Spinner Searchlight Beam
    this.cyberpunk.searchlightAngle = (this.cyberpunk.searchlightAngle + 0.007) % (Math.PI * 2);
    const towerX = W * 0.35;
    const towerY = horizonY - 140;
    const beamAngle = -Math.PI * 0.5 + Math.sin(this.cyberpunk.searchlightAngle) * 0.75;
    const beamLen = Math.max(W, H) * 0.85;
    const beamSpread = 0.22;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(towerX, towerY);
    ctx.arc(towerX, towerY, beamLen, beamAngle - beamSpread, beamAngle + beamSpread);
    ctx.closePath();
    const beamGrad = ctx.createRadialGradient(towerX, towerY, 10, towerX, towerY, beamLen);
    beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    beamGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.08)');
    beamGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = beamGrad;
    ctx.fill();
    ctx.restore();

    // 4. Cyber City Skyline Silhouettes
    ctx.save();
    for (let b of this.cyberpunk.skyline) {
      const bY = horizonY - b.h;

      // Dark building body
      ctx.fillStyle = '#070b1a';
      ctx.fillRect(b.x, bY, b.w, b.h + (H - horizonY));

      // Neon rooftop edge accent
      ctx.strokeStyle = b.edgeColor;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(b.x, bY, b.w, b.h + (H - horizonY));

      // Windows
      for (let w of b.windows) {
        const wx = b.x + w.rx;
        const wy = bY + w.ry;
        if (wy < horizonY - 10) {
          w.flicker += 0.03;
          const wAlpha = 0.35 + 0.45 * Math.sin(w.flicker);
          ctx.fillStyle = w.color;
          ctx.globalAlpha = wAlpha;
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
      ctx.globalAlpha = 1.0;

      // Communication Spire & Blinking Beacon
      if (b.hasAntenna) {
        const ax = b.x + b.w * 0.5;
        const ay = bY - b.antennaH;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, bY);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        // Blinking red aviation warning light
        const beaconPulse = 0.5 + 0.5 * Math.sin(this.time * 4 + b.x);
        if (beaconPulse > 0.3) {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(ax, ay, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
    ctx.restore();

    // 5. Perspective Cyber Grid Highway (Bottom Ground)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    const gridGroundY = horizonY + 20;

    // Longitudinal vanishing lines
    const rays = 12;
    for (let i = 0; i <= rays; i++) {
      const gx = (i / rays) * W * 1.4 - W * 0.2;
      ctx.beginPath();
      ctx.moveTo(W * 0.5, gridGroundY);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }

    // Moving horizontal grid lines
    const gridOffset = (this.time * 20) % 35;
    for (let y = gridGroundY + gridOffset; y < H; y += 35) {
      const alpha = Math.min(0.35, (y - gridGroundY) / (H - gridGroundY) * 0.4);
      ctx.strokeStyle = `rgba(217, 70, 239, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();

    // 6. Neon Acid Rain
    ctx.save();
    for (let r of this.cyberpunk.rain) {
      r.y += r.speed;
      r.x += 1.4; // slight wind slant

      if (r.y > H + 20 || r.x > W + 50) {
        r.y = -r.len - Math.random() * 50;
        r.x = Math.random() * (W + 100) - 50;
      }

      const grad = ctx.createLinearGradient(r.x, r.y - r.len, r.x, r.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, r.color);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = r.alpha;
      ctx.beginPath();
      ctx.moveTo(r.x - 1.4 * (r.len / r.speed), r.y - r.len);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ==========================================================
     5. MONOCHROME AMBER: 1983 WOPR / NORAD 3D VECTOR GLOBE & TELEMETRY
     ========================================================== */
  renderAmber(ctx, W, H) {
    // CRT Amber phosphor persistence
    ctx.fillStyle = 'rgba(10, 6, 2, 0.22)';
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.48;
    const radius = Math.min(W, H) * 0.28;
    this.amber.rotY += 0.008;

    const tilt = this.amber.rotX;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const cosRotY = Math.cos(this.amber.rotY);
    const sinRotY = Math.sin(this.amber.rotY);

    ctx.save();

    // 1. Draw 3D Globe Latitude Rings
    const latCount = 8;
    for (let i = 1; i < latCount; i++) {
      const latAngle = ((i / latCount) - 0.5) * Math.PI * 0.75;
      const ringR = radius * Math.cos(latAngle);
      const ringY0 = -radius * Math.sin(latAngle);

      // Generate points around ring
      const points = [];
      const steps = 36;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        let x = ringR * Math.cos(a);
        let z = ringR * Math.sin(a);
        let y = ringY0;

        // Rotate Y
        let rx = x * cosRotY + z * sinRotY;
        let rz = -x * sinRotY + z * cosRotY;

        // Tilt X
        let ry = y * cosTilt - rz * sinTilt;
        let finalZ = y * sinTilt + rz * cosTilt;

        points.push({
          px: cx + rx,
          py: cy + ry,
          z: finalZ
        });
      }

      // Draw ring in segments (front vs back)
      for (let s = 0; s < steps; s++) {
        const p1 = points[s];
        const p2 = points[s + 1];
        const isFront = p1.z > 0 || p2.z > 0;

        ctx.strokeStyle = isFront ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)';
        ctx.lineWidth = isFront ? 1.4 : 0.8;
        if (isFront) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
    }

    // 2. Draw 3D Globe Longitude Meridians
    const lonCount = 12;
    for (let i = 0; i < lonCount; i++) {
      const lonAngle = (i / lonCount) * Math.PI;
      const points = [];
      const steps = 36;

      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        let x = radius * Math.cos(a) * Math.sin(lonAngle);
        let y = radius * Math.sin(a);
        let z = radius * Math.cos(a) * Math.cos(lonAngle);

        // Rotate Y
        let rx = x * cosRotY + z * sinRotY;
        let rz = -x * sinRotY + z * cosRotY;

        // Tilt X
        let ry = y * cosTilt - rz * sinTilt;
        let finalZ = y * sinTilt + rz * cosTilt;

        points.push({
          px: cx + rx,
          py: cy + ry,
          z: finalZ
        });
      }

      for (let s = 0; s < steps; s++) {
        const p1 = points[s];
        const p2 = points[s + 1];
        const isFront = p1.z > 0 || p2.z > 0;

        ctx.strokeStyle = isFront ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)';
        ctx.lineWidth = isFront ? 1.4 : 0.8;
        if (isFront) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
    }

    // 3. Globe Equator (Highlighted)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let s = 0; s <= 48; s++) {
      const a = (s / 48) * Math.PI * 2;
      let x = radius * Math.cos(a);
      let z = radius * Math.sin(a);
      let rx = x * cosRotY + z * sinRotY;
      let rz = -x * sinRotY + z * cosRotY;
      let ry = -rz * sinTilt;
      if (s === 0) ctx.moveTo(cx + rx, cy + ry);
      else ctx.lineTo(cx + rx, cy + ry);
    }
    ctx.stroke();

    // 4. Orbiting Satellite
    this.amber.satelliteAngle = (this.amber.satelliteAngle + 0.018) % (Math.PI * 2);
    const satOrbitR = radius * 1.45;
    const satA = this.amber.satelliteAngle;
    const satX = cx + Math.cos(satA) * satOrbitR;
    const satY = cy + Math.sin(satA) * (satOrbitR * 0.42);

    // Satellite orbital path ring
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(cx, cy, satOrbitR, satOrbitR * 0.42, 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Satellite Beacon
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(satX, satY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Military Telemetry HUD in corners
    ctx.font = '12px "VT323", "JetBrains Mono", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 6;

    // Top Left Telemetry
    ctx.fillText("[NORAD STRATEGIC CMD // WOPR-01]", 24, 35);
    ctx.fillText("SAT_TELEMETRY: TRACKING [SAT-7 LOCKED]", 24, 52);
    ctx.fillText("CARRIER_FREQ: 1420.405 MHz // AZIMUTH: 042°", 24, 69);

    // Bottom Right Coordinates (Anhelm in Brest)
    const strBrest = "TARGET: BREST, BELARUS [52°05'N 23°41'E]";
    const strStatus = "SYSTEM PHOSPHOR: P3-AMBER // STATUS: SECURE";
    if (W > 700) {
      ctx.fillText(strBrest, W - ctx.measureText(strBrest).width - 24, H - 45);
      ctx.fillText(strStatus, W - ctx.measureText(strStatus).width - 24, H - 28);
    }

    ctx.restore();
  }

  /* ==========================================================
     6. WIN98: ICONIC WINDOWS 98 3D PIPES SCREENSAVER
     ========================================================== */
  renderWin98(ctx, W, H) {
    ctx.clearRect(0, 0, W, H);

    const R = this.win98.radius;
    const speed = 3.2;

    ctx.save();

    for (let pipe of this.win98.pipes) {
      // 1. Advance pipe head in current direction
      pipe.headX += pipe.dir.dx * speed;
      pipe.headY += pipe.dir.dy * speed;
      pipe.distance += speed;

      // 2. Check if near screen boundaries or turn distance exceeded
      const pad = 40;
      const hitWall =
        (pipe.dir.dx > 0 && pipe.headX >= W - pad) ||
        (pipe.dir.dx < 0 && pipe.headX <= pad) ||
        (pipe.dir.dy > 0 && pipe.headY >= H - pad) ||
        (pipe.dir.dy < 0 && pipe.headY <= pad);

      if (hitWall || pipe.distance >= pipe.maxDistance) {
        // Clamp to screen boundaries if hitting wall
        if (pipe.headX >= W - pad) pipe.headX = W - pad;
        if (pipe.headX <= pad) pipe.headX = pad;
        if (pipe.headY >= H - pad) pipe.headY = H - pad;
        if (pipe.headY <= pad) pipe.headY = pad;

        // Record completed segment
        pipe.segments.push({
          x1: pipe.x,
          y1: pipe.y,
          x2: pipe.headX,
          y2: pipe.headY,
          dir: { ...pipe.dir }
        });

        // Record joint at the corner
        pipe.joints.push({ x: pipe.headX, y: pipe.headY });

        // Choose new perpendicular direction
        let newDir;
        if (pipe.dir.dy === 0) {
          // Moving horizontally: turn vertical
          if (pipe.headY >= H - pad - 60) newDir = { dx: 0, dy: -1 };
          else if (pipe.headY <= pad + 60) newDir = { dx: 0, dy: 1 };
          else newDir = { dx: 0, dy: Math.random() > 0.5 ? 1 : -1 };
        } else {
          // Moving vertically: turn horizontal
          if (pipe.headX >= W - pad - 60) newDir = { dx: -1, dy: 0 };
          else if (pipe.headX <= pad + 60) newDir = { dx: 1, dy: 0 };
          else newDir = { dx: Math.random() > 0.5 ? 1 : -1, dy: 0 };
        }

        pipe.dir = newDir;
        pipe.x = pipe.headX;
        pipe.y = pipe.headY;
        pipe.distance = 0;
        pipe.maxDistance = Math.floor(Math.random() * 65 + 40);

        // Keep segment length reasonable (~20 segments per pipe)
        if (pipe.segments.length > 20) {
          pipe.segments.shift();
          if (pipe.joints.length > 20) pipe.joints.shift();
        }
      }

      // 3. Render Historical Segments with 3D Cylindrical Shading
      for (let s = 0; s < pipe.segments.length; s++) {
        const seg = pipe.segments[s];
        const alpha = 0.25 + (s / pipe.segments.length) * 0.75;
        ctx.globalAlpha = alpha;

        const isHoriz = seg.dir.dy === 0;
        const minX = Math.min(seg.x1, seg.x2);
        const maxX = Math.max(seg.x1, seg.x2);
        const minY = Math.min(seg.y1, seg.y2);
        const maxY = Math.max(seg.y1, seg.y2);

        if (isHoriz) {
          const cy = seg.y1;
          const grad = ctx.createLinearGradient(0, cy - R, 0, cy + R);
          grad.addColorStop(0.0, pipe.palette.shadow);
          grad.addColorStop(0.25, pipe.palette.highlight);
          grad.addColorStop(0.6, pipe.palette.mid);
          grad.addColorStop(1.0, pipe.palette.shadow);
          ctx.fillStyle = grad;
          ctx.fillRect(minX, cy - R, Math.max(1, maxX - minX), R * 2);
        } else {
          const cx = seg.x1;
          const grad = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
          grad.addColorStop(0.0, pipe.palette.shadow);
          grad.addColorStop(0.25, pipe.palette.highlight);
          grad.addColorStop(0.6, pipe.palette.mid);
          grad.addColorStop(1.0, pipe.palette.shadow);
          ctx.fillStyle = grad;
          ctx.fillRect(cx - R, minY, R * 2, Math.max(1, maxY - minY));
        }
      }

      // 4. Render Currently Growing Segment
      ctx.globalAlpha = 1.0;
      const isCurHoriz = pipe.dir.dy === 0;
      const curMinX = Math.min(pipe.x, pipe.headX);
      const curMaxX = Math.max(pipe.x, pipe.headX);
      const curMinY = Math.min(pipe.y, pipe.headY);
      const curMaxY = Math.max(pipe.y, pipe.headY);

      if (isCurHoriz) {
        const cy = pipe.y;
        const grad = ctx.createLinearGradient(0, cy - R, 0, cy + R);
        grad.addColorStop(0.0, pipe.palette.shadow);
        grad.addColorStop(0.25, pipe.palette.highlight);
        grad.addColorStop(0.6, pipe.palette.mid);
        grad.addColorStop(1.0, pipe.palette.shadow);
        ctx.fillStyle = grad;
        ctx.fillRect(curMinX, cy - R, Math.max(1, curMaxX - curMinX), R * 2);
      } else {
        const cx = pipe.x;
        const grad = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
        grad.addColorStop(0.0, pipe.palette.shadow);
        grad.addColorStop(0.25, pipe.palette.highlight);
        grad.addColorStop(0.6, pipe.palette.mid);
        grad.addColorStop(1.0, pipe.palette.shadow);
        ctx.fillStyle = grad;
        ctx.fillRect(cx - R, curMinY, R * 2, Math.max(1, curMaxY - curMinY));
      }

      // 5. Render Spherical Elbow Joints
      for (let j of pipe.joints) {
        const sph = ctx.createRadialGradient(j.x - R * 0.35, j.y - R * 0.35, 1, j.x, j.y, R);
        sph.addColorStop(0, pipe.palette.highlight);
        sph.addColorStop(0.4, pipe.palette.mid);
        sph.addColorStop(1, pipe.palette.shadow);
        ctx.fillStyle = sph;
        ctx.beginPath();
        ctx.arc(j.x, j.y, R, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Moving Lead Spherical Cap at Head
      const leadSph = ctx.createRadialGradient(pipe.headX - R * 0.35, pipe.headY - R * 0.35, 1, pipe.headX, pipe.headY, R);
      leadSph.addColorStop(0, pipe.palette.highlight);
      leadSph.addColorStop(0.4, pipe.palette.mid);
      leadSph.addColorStop(1, pipe.palette.shadow);
      ctx.fillStyle = leadSph;
      ctx.beginPath();
      ctx.arc(pipe.headX, pipe.headY, R, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* ==========================================================
     7. VIRTUAL BOY: 3D ROTATING WIREFRAME CUBE & TUNNEL
     ========================================================== */
  renderVirtualBoy(ctx, W, H) {
    // Red Void Persistence
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.5;
    const vb = this.virtualboy;

    // 1. Moving Wireframe Portals
    ctx.save();
    for (let tun of vb.tunnels) {
      tun.z -= 4;
      if (tun.z <= 20) tun.z = 800;

      const scale = 250 / tun.z;
      const tw = W * 0.55 * scale;
      const th = H * 0.55 * scale;
      const alpha = Math.min(0.6, (800 - tun.z) / 400);

      ctx.strokeStyle = `rgba(255, 34, 34, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - tw * 0.5, cy - th * 0.5, tw, th);
    }
    ctx.restore();

    // 2. 3D Rotating Cube Math
    vb.rotX += 0.012;
    vb.rotY += 0.016;
    vb.rotZ += 0.008;

    const size = Math.min(W, H) * 0.16;
    // 8 vertices of cube in local 3D coords
    const baseVerts = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];

    // Rotation matrices
    const cosX = Math.cos(vb.rotX), sinX = Math.sin(vb.rotX);
    const cosY = Math.cos(vb.rotY), sinY = Math.sin(vb.rotY);
    const cosZ = Math.cos(vb.rotZ), sinZ = Math.sin(vb.rotZ);

    const projected = baseVerts.map(v => {
      let x = v[0] * size;
      let y = v[1] * size;
      let z = v[2] * size;

      // Rotate around X
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      // Rotate around Y
      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;

      // Rotate around Z
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      // Perspective divide
      const fov = 400;
      const pScale = fov / (fov + z2 + 350);
      return {
        x: cx + x3 * pScale,
        y: cy + y3 * pScale
      };
    });

    // 12 Edges connecting vertices
    const edges = [
      [0,1], [1,2], [2,3], [3,0], // back face
      [4,5], [5,6], [6,7], [7,4], // front face
      [0,4], [1,5], [2,6], [3,7]  // connecting edges
    ];

    ctx.save();
    ctx.strokeStyle = '#ff2222';
    ctx.shadowColor = '#ff2222';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.2;

    for (let e of edges) {
      ctx.beginPath();
      ctx.moveTo(projected[e[0]].x, projected[e[0]].y);
      ctx.lineTo(projected[e[1]].x, projected[e[1]].y);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// Global instance
window.bgEngine = new RetroBackgroundEngine();
window.bgDvd = window.bgEngine; // backwards compatibility
