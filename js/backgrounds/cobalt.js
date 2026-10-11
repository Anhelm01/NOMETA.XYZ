/* ==========================================================
   RETRO BACKGROUND // CLEAN STEALTH CYBER-DECK
   Deep dark void, subtle drifting stars & fine titanium grid
   ========================================================== */

class CobaltBackground {
  constructor() {
    this.gridOffset = 0;
    this.stars = [];
  }

  init(W, H) {
    this.stars = [];
    const count = Math.floor(Math.min(W, 1200) / 25);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() > 0.85 ? 1.5 : 1,
        alpha: 0.15 + Math.random() * 0.45,
        speed: 0.1 + Math.random() * 0.25
      });
    }
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    ctx.clearRect(0, 0, W, H);

    // Deep matte black canvas
    ctx.fillStyle = '#040508';
    ctx.fillRect(0, 0, W, H);

    // Subtle drifting stars
    ctx.save();
    for (let s of this.stars) {
      s.y += s.speed;
      if (s.y > H) {
        s.y = 0;
        s.x = Math.random() * W;
      }
      ctx.fillStyle = `rgba(203, 213, 225, ${s.alpha * (0.6 + 0.4 * Math.sin(time * 1.5 + s.x))})`;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    }
    ctx.restore();

    // Subtle hairline perspective grid
    const horizY = H * 0.6;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';

    // Horizontal perspective lines
    let curY = horizY;
    let step = 4;
    while (curY < H) {
      ctx.beginPath();
      ctx.moveTo(0, curY);
      ctx.lineTo(W, curY);
      ctx.stroke();
      step = step * 1.25 + 1;
      curY += step;
    }

    // Vertical radiating lines
    const vpX = W * 0.5;
    const numLines = Math.floor(W / 55);
    for (let i = -numLines; i <= numLines; i++) {
      const bottomX = vpX + i * 65;
      ctx.beginPath();
      ctx.moveTo(vpX, horizY);
      ctx.lineTo(bottomX, H);
      ctx.stroke();
    }
    ctx.restore();
  }
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-cobalt'] = new CobaltBackground();
