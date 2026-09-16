/* ==========================================================
   RETRO BACKGROUND // 2. GREEN CRT
   Matrix P1 Phosphor Digital Code Rain
   ========================================================== */

class MatrixBackground {
  constructor() {
    this.drops = [];
    this.chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF:・."=*+-<>¦|';
    this.fontSize = 15;
    this.columns = 0;
  }

  init(W, H) {
    this.columns = Math.floor(W / this.fontSize);
    this.drops = [];
    for (let c = 0; c < this.columns; c++) {
      this.drops.push({
        y: Math.floor(Math.random() * -H),
        speed: 2 + Math.random() * 3.5,
        length: Math.floor(12 + Math.random() * 18),
        chars: []
      });
    }
  }

  resize(W, H) {
    this.init(W, H);
  }

  render(ctx, W, H, time) {
    // Phosphor persistence decay
    ctx.fillStyle = 'rgba(2, 11, 5, 0.18)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;

    const drops = this.drops;
    const chars = this.chars;
    const fs = this.fontSize;

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
}

window.RetroBackgrounds = window.RetroBackgrounds || {};
window.RetroBackgrounds['theme-green-crt'] = new MatrixBackground();
