/* ==========================================================
   RETRO BACKGROUND // 4. CYBERPUNK 2099
   Neo-Tokyo Skyline, Searchlight Beam, Cyber Grid & Neon Rain
   ========================================================== */

class CyberpunkBackground {
  constructor() {
    this.skyline = [];
    this.rain = [];
    this.searchlightAngle = 0;
  }

  init(W, H) {
    // Generate Neo-Tokyo skyline
    this.skyline = [];
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

      this.skyline.push({
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
    this.rain = [];
    for (let i = 0; i < 70; i++) {
      this.rain.push({
        x: Math.random() * (W + 100) - 50,
        y: Math.random() * H,
        speed: 13 + Math.random() * 8,
        len: 20 + Math.random() * 25,
        color: Math.random() > 0.45 ? '#00f0ff' : '#ff007f',
        alpha: 0.3 + Math.random() * 0.4
      });
    }
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
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
    haze.addColorStop(0, 'rgba(217, 70, 239, 0.16)');
    haze.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
    haze.addColorStop(1, 'transparent');
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizonY - H * 0.4, W, H * 0.5);
    ctx.restore();

    // 3. Sweeping Police Spinner Searchlight Beam
    this.searchlightAngle = (this.searchlightAngle + 0.007) % (Math.PI * 2);
    const towerX = W * 0.35;
    const towerY = horizonY - 140;
    const beamAngle = -Math.PI * 0.5 + Math.sin(this.searchlightAngle) * 0.75;
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
    for (let b of this.skyline) {
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
        const beaconPulse = 0.5 + 0.5 * Math.sin(time * 4 + b.x);
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
    const gridOffset = (time * 20) % 35;
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
    for (let r of this.rain) {
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
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-cyberpunk'] = new CyberpunkBackground();
