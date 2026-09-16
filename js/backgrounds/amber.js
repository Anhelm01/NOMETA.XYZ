/* ==========================================================
   RETRO BACKGROUND // 5. MONOCHROME AMBER
   1983 WOPR / NORAD 3D Vector Globe, Satellite & Telemetry HUD
   ========================================================== */

class AmberBackground {
  constructor() {
    this.rotY = 0;
    this.rotX = 0.38;
    this.satelliteAngle = 0;
  }

  init(W, H) {
    this.rotY = 0;
    this.satelliteAngle = 0;
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    // CRT Amber phosphor persistence
    ctx.fillStyle = 'rgba(10, 6, 2, 0.22)';
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.48;
    const radius = Math.min(W, H) * 0.28;
    this.rotY += 0.008;

    const tilt = this.rotX;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const cosRotY = Math.cos(this.rotY);
    const sinRotY = Math.sin(this.rotY);

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
    this.satelliteAngle = (this.satelliteAngle + 0.018) % (Math.PI * 2);
    const satOrbitR = radius * 1.45;
    const satA = this.satelliteAngle;
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
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-amber'] = new AmberBackground();
