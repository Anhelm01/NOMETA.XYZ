/* ==========================================================
   RETRO BACKGROUND // 3. OBSIDIAN PURPLE
   Bouncing Neon DVD Video Logo & Cyber Dust Particles
   ========================================================== */

class DvdBackground {
  constructor() {
    this.img = new Image();
    this.imgLoaded = false;
    this.x = 80;
    this.y = 80;
    this.vx = 2.2;
    this.vy = 1.7;
    this.width = 160;
    this.height = 86;
    this.colors = ['#a855f7', '#00f0ff', '#00ff66', '#facc15', '#f43f5e', '#38bdf8'];
    this.colorIndex = 0;
    this.dust = [];

    this.img.src = 'assets/images/dvd-video.png';
    this.img.onload = () => {
      this.imgLoaded = true;
    };
  }

  init(W, H) {
    this.x = Math.floor(Math.random() * Math.max(20, W - this.width - 40)) + 20;
    this.y = Math.floor(Math.random() * Math.max(20, H - this.height - 40)) + 20;
    this.vx = (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 0.7);
    this.vy = (Math.random() > 0.5 ? 1 : -1) * (1.4 + Math.random() * 0.7);
    this.dust = [];
    for (let i = 0; i < 35; i++) {
      this.dust.push({
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
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    ctx.clearRect(0, 0, W, H);

    // 1. Ambient Cyber Dust particles
    ctx.save();
    for (let p of this.dust) {
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
    this.x += this.vx;
    this.y += this.vy;

    let hit = false;
    if (this.x + this.width >= W) {
      this.x = W - this.width;
      this.vx = -Math.abs(this.vx);
      hit = true;
    } else if (this.x <= 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
      hit = true;
    }

    if (this.y + this.height >= H) {
      this.y = H - this.height;
      this.vy = -Math.abs(this.vy);
      hit = true;
    } else if (this.y <= 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
      hit = true;
    }

    if (hit) {
      this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    }

    if (!this.imgLoaded) return;

    // Render DVD Logo
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.shadowColor = this.colors[this.colorIndex];
    ctx.shadowBlur = 24;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = this.colors[this.colorIndex];
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Subtle scanlines across DVD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    for (let s = this.y; s < this.y + this.height; s += 3) {
      ctx.fillRect(this.x, s, this.width, 1.2);
    }
    ctx.restore();
  }
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-obsidian'] = new DvdBackground();
