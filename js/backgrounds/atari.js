/* ==========================================================
   RETRO BACKGROUND // 1. ATARI VCS
   Synthwave Horizon Grid, Striped Sunset Sun & Twinkling Stars
   ========================================================== */

class AtariBackground {
  constructor() {
    this.gridOffset = 0;
    this.stars = [];
  }

  init(W, H) {
    this.stars = [];
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: Math.random() * W,
        y: Math.random() * (H * 0.58),
        size: Math.random() > 0.85 ? 3 : (Math.random() > 0.5 ? 2 : 1),
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04
      });
    }
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    ctx.clearRect(0, 0, W, H);

    const horizY = H * 0.58;
    const vpX = W * 0.5;

    // 1. Vector stars in upper sky
    ctx.save();
    for (let s of this.stars) {
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
    ctx.arc(sunX, sunY, sunR, Math.PI, 0, false);
    ctx.arc(sunX, sunY, sunR, 0, Math.PI, false);
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
    this.gridOffset = (this.gridOffset + 0.007) % 1;

    // Transverse lines (horizontal lines moving forward)
    const lineCount = 15;
    for (let i = 0; i < lineCount; i++) {
      const progress = (i + this.gridOffset) / lineCount;
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
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-atari'] = new AtariBackground();
