/* ==========================================================
   RETRO BACKGROUND // 6. WIN98 3D PIPES
   Iconic Windows 98 3D Pipes Screensaver with Cylinders & Joints
   ========================================================== */

class Win98PipesBackground {
  constructor() {
    this.pipes = [];
    this.radius = 10;
    this.maxPipes = 4;
  }

  init(W, H) {
    const palettes = [
      { highlight: '#ffffff', mid: '#c0c0c0', shadow: '#383838' }, // Chrome Silver
      { highlight: '#93c5fd', mid: '#000080', shadow: '#000028' }, // Windows Blue
      { highlight: '#fef08a', mid: '#ca8a04', shadow: '#582c06' }, // Brass Gold
      { highlight: '#67e8f9', mid: '#0f766e', shadow: '#042f2e' }  // Desktop Teal Copper
    ];

    this.pipes = [];
    for (let i = 0; i < this.maxPipes; i++) {
      const startX = Math.floor(Math.random() * (W - 200) + 100);
      const startY = Math.floor(Math.random() * (H - 200) + 100);
      const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
      const dir = dirs[i % dirs.length];

      this.pipes.push({
        x: startX,
        y: startY,
        headX: startX,
        headY: startY,
        dir: dir,
        palette: palettes[i % palettes.length],
        segments: [],
        joints: [{ x: startX, y: startY }],
        distance: 0,
        maxDistance: Math.floor(Math.random() * 60 + 45)
      });
    }
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    ctx.clearRect(0, 0, W, H);

    const R = this.radius;
    const speed = 3.2;

    ctx.save();

    for (let pipe of this.pipes) {
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
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-win98'] = new Win98PipesBackground();
