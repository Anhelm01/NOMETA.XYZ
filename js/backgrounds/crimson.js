/* ==========================================================
   RETRO BACKGROUND // CRIMSON BLOOD-WINE TERMINAL
   Dark telemetry scanlines, crimson phosphor particles
   ========================================================== */

class CrimsonBackground {
  constructor() {
    this.scanY = 0;
    this.dust = [];
  }

  init(W, H) {
    this.dust = [];
    const count = Math.floor(Math.min(W, 1200) / 25);
    for (let i = 0; i < count; i++) {
      this.dust.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() > 0.8 ? 2 : 1,
        alpha: 0.15 + Math.random() * 0.5,
        speed: 0.1 + Math.random() * 0.3
      });
    }
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    ctx.clearRect(0, 0, W, H);

    // Drifting crimson particles overlay
    ctx.save();
    for (let d of this.dust) {
      d.y -= d.speed;
      if (d.y < 0) {
        d.y = H;
        d.x = Math.random() * W;
      }
      ctx.fillStyle = `rgba(244, 63, 94, ${d.alpha * (0.5 + 0.5 * Math.sin(time * 3 + d.x))})`;
      ctx.fillRect(Math.floor(d.x), Math.floor(d.y), d.size, d.size);
    }
    ctx.restore();

    // Sweeping telemetry scan beam
    this.scanY = (this.scanY + 1.2) % (H + 40);
    ctx.save();
    const beamGrad = ctx.createLinearGradient(0, this.scanY - 30, 0, this.scanY);
    beamGrad.addColorStop(0, 'rgba(225, 29, 72, 0)');
    beamGrad.addColorStop(1, 'rgba(225, 29, 72, 0.08)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(0, Math.max(0, this.scanY - 30), W, 30);
    ctx.restore();
  }
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-crimson'] = new CrimsonBackground();
