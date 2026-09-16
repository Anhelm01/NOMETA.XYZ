# ANHELM — Personal Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-anhelm.men-10b981?style=flat-square&logo=googlechrome&logoColor=white)](https://anhelm.men/)
[![Release](https://img.shields.io/badge/Release-v1.4-2563eb?style=flat-square)](https://github.com/Anhelm01/NOMETA.XYZ)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-f59e0b?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-6b7280?style=flat-square)](LICENSE)

Personal portfolio and creative showcase of **Anhelm** — Designer, Video Editor, Content Manager, and Python Developer based in Brest, Belarus.

Designed in the aesthetic of vintage desktop operating systems and classic media software (Windows 98, Winamp, CRT displays), engineered entirely with pure Vanilla web technologies for instant load times, 60 FPS animations, and zero framework overhead.

---

## Overview

The site combines nostalgic retro computing visuals with modern web standards and responsive design:
- **Zero Dependencies**: Pure HTML5, CSS3, and modern ES6+ JavaScript — no heavy frameworks or bloated bundles.
- **Hardware-Accelerated Visuals**: Canvas 2D background engine with HiDPI / Retina display scaling and battery-aware animation loops.
- **Accessible & Touch-Friendly**: Full mobile touch support with native vertical scroll freedom, keyboard-accessible audio controls, and semantic markup.

---

## Key Features

### Desktop Window Management
- **Draggable Windows**: Smooth pointer-drag mechanics with viewport clamping to keep titlebars always accessible.
- **Window Controls**: Minimize, Maximize (fullscreen overlay with isolated scroll), Close, and reset position on double-click.
- **Taskbar Restoration**: Clicking icons in the top navigation bar (`#profile`, `#player`, `#projects`, `#contacts`) instantly restores closed or minimized windows and smoothly scrolls to them.

### Mobile-First Touch Experience
- On screens <= 768px and touch devices, window dragging is automatically disabled and `touch-action: pan-y` is enforced.
- Windows seamlessly adapt into neat vertical cards, ensuring completely free and natural vertical scrolling without gesture interception.

### Modular Canvas Background Engine
- 7 procedural real-time retro themes selectable via the top navigation bar:
  1. **Atari VCS** — Classic vector starfield.
  2. **Matrix Digital Rain** — Falling green phosphor glyphs.
  3. **DVD Screensaver** — Physics-based bouncing retro DVD video logo.
  4. **Cyberpunk 2099** — Glowing neon perspective grid and stars.
  5. **Monochrome Amber** — Warm amber terminal phosphor particles.
  6. **Win98 Teal** — Classic 3D pipe maze with beveled styling.
  7. **Virtual Boy Red** — Retro red wireframe vector aesthetics.
- **Retina / HiDPI Support**: Automatically scales using `devicePixelRatio` (capped at 2) for crisp rendering on high-density displays.
- **Performance Guards**: 30 FPS throttle on mobile devices, automatic pause via `visibilitychange` when the tab is in the background, and respect for `prefers-reduced-motion`.

### Retro Audio Deck (Winamp Mini)
- Direct HTML5 Audio playback of MC Ren's *I Don't Give A Damn* (`assets/music/mc-ren.mp3`).
- Real-time 60 FPS spectrum visualizer.
- Clickable album artwork to toggle playback.
- Interactive scrub timeline with mouse seeking and keyboard arrow controls (Seek +-5 seconds, Space to toggle).

### Interactive Portfolio Showcase
- Filter projects dynamically by category (`[ALL]`, `[VIDEO EDIT]`, `[CONTENT]`, `[DESIGN]`, `[PYTHON]`) with smooth opacity and transform transitions.
- High-contrast badges, tech stack tags, and optimized lazy-loaded previews.

### CRT Monitor Overlay
- Authentic CRT scanlines, vignette darkening, and phosphor sweep beam.
- Instant CRT toggle switch in the taskbar (`CRT: ON` / `CRT: OFF`).

### SEO & Web Performance
- Valid OpenGraph and Twitter Card social preview metadata.
- Schema.org JSON-LD `Person` structured data.
- Font preconnections for Google Fonts (`JetBrains Mono`, `Space Mono`, `Press Start 2P`, `VT323`).
- Search engine crawler directives (`robots.txt`) and sitemap (`sitemap.xml`).
- Versioned asset query strings (`?v=1.4`) for immediate cache invalidation across deployments.

---

## Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic structure, accessibility attributes, JSON-LD metadata |
| **Styling** | CSS3 | Custom properties, CSS Grid / Flexbox, CRT scanline overlay |
| **Logic** | Vanilla JavaScript (ES6+) | Window manager, modular background coordinator, audio player |
| **Graphics** | HTML5 Canvas 2D API | Procedural background animations with DPR awareness |
| **Audio** | HTML5 Audio API | Direct audio streaming and dynamic visualizer |
| **Fonts** | Google Fonts | JetBrains Mono, Space Mono, Press Start 2P, VT323 |

---

## Project Structure

```text
NOMETA.XYZ/
├── assets/
│   ├── images/              # Optimized portfolio artwork and icons
│   ├── music/               # Audio tracks (MC Ren - I Don't Give A Damn)
│   └── errors.txt           # Dynamic system alert phrases for easter egg
├── css/
│   ├── main.css             # Base reset, typography, and theme color variables
│   ├── retro-components.css # Window manager, taskbar, buttons, and dialog styling
│   ├── crt-effects.css      # Scanlines, vignette, and phosphor CRT effects
│   └── responsive.css       # Mobile touch layout and responsive breakpoint rules
├── js/
│   ├── backgrounds/         # Modular canvas background renderers
│   │   ├── atari.js         # Atari vector starfield
│   │   ├── matrix.js        # Green matrix digital rain
│   │   ├── dvd.js           # Bouncing retro DVD video logo
│   │   ├── cyberpunk.js     # Neon perspective grid
│   │   ├── amber.js         # Monochrome amber particles
│   │   ├── win98-pipes.js   # 3D Windows 98 pipe maze
│   │   └── virtualboy.js    # Virtual Boy red wireframe vectors
│   ├── background-engine.js # Background coordinator and lifecycle manager
│   ├── audio-player.js      # HTML5 Audio engine and spectrum visualizer
│   ├── windows.js           # Window manager, desktop drag, and dialogs
│   ├── sound-fx.js          # Retro UI synthesized sound effects
│   └── app.js               # Theme selector, CRT toggle, and copy handlers
├── index.html               # Main application entry point
├── robots.txt               # Search engine crawler directives
├── sitemap.xml              # Search engine XML sitemap
├── LICENSE                  # MIT License
└── CNAME                    # Custom domain mapping (anhelm.men)
```

---

## Local Development

No build steps, package managers, or external bundlers are required.

### 1. Clone the repository
```bash
git clone https://github.com/Anhelm01/NOMETA.XYZ.git
cd NOMETA.XYZ
```

### 2. Run a local static server

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node (npx):**
```bash
npx serve .
```

**Using VS Code:**
Install the **Live Server** extension and click **Go Live**.

Open `http://localhost:8000` in your browser.

---

## Contact & Socials

- **Website**: [anhelm.men](https://anhelm.men/)
- **Telegram**: [@Anhelm_Never_Die](https://t.me/Anhelm_Never_Die)
- **Email**: [anhelm0@hotmail.com](mailto:anhelm0@hotmail.com)
- **Discord**: `anhelm#6153`
- **Location**: Brest, Belarus

---

## License

This project is licensed under the [MIT License](LICENSE) — see the [LICENSE](LICENSE) file for details.

© 2026 Anhelm. All rights reserved.
