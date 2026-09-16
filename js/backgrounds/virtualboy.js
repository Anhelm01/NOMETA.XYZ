/* ==========================================================
   RETRO BACKGROUND // 7. VIRTUAL BOY
   3D Rotating Red Wireframe Cube & Perspective Tunnel Portals
   ========================================================== */

class VirtualBoyBackground {
  constructor() {
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.tunnels = [];
  }

  init(W, H) {
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.tunnels = [
      { z: 100 },
      { z: 300 },
      { z: 500 },
      { z: 700 }
    ];
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    // Red Void Persistence
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.5;

    // 1. Moving Wireframe Portals
    ctx.save();
    for (let tun of this.tunnels) {
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
    this.rotX += 0.012;
    this.rotY += 0.016;
    this.rotZ += 0.008;

    const size = Math.min(W, H) * 0.16;
    // 8 vertices of cube in local 3D coords
    const baseVerts = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];

    // Rotation matrices
    const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
    const cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);

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

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-virtualboy'] = new VirtualBoyBackground();
