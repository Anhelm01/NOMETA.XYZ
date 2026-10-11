/* ==========================================================
   ANHELM // MAIN APPLICATION COORDINATOR
   Theme selector, Live World Clock, CRT toggle & copy feedback
   ========================================================== */

function initApp() {
  // 1. Theme Dropdown Switcher
  const themeSelect = document.getElementById('theme-selector');
  const allThemes = [
    'theme-cobalt',
    'theme-crimson',
    'theme-green-crt',
    'theme-amber',
    'theme-cyberpunk'
  ];

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      allThemes.forEach(t => document.body.classList.remove(t));
      document.body.classList.add(selected);

      if (window.bgEngine && typeof window.bgEngine.setTheme === 'function') {
        window.bgEngine.setTheme(selected);
      }

      if (window.soundFX) window.soundFX.playToggle(true);
    });
  }

  // 2. Live World Clock Engine (Brest, Tokyo, New York)
  function updateWorldClocks() {
    const now = new Date();

    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const dateOptions = {
      day: '2-digit',
      month: 'short',
      weekday: 'short'
    };

    // Helper formatter
    const formatZone = (tz) => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-GB', { ...timeOptions, timeZone: tz }).format(now);
        const dateStr = new Intl.DateTimeFormat('en-GB', { ...dateOptions, timeZone: tz }).format(now);
        return { time: timeStr, date: dateStr.toUpperCase() };
      } catch (err) {
        return { time: '--:--:--', date: '---' };
      }
    };

    const brest = formatZone('Europe/Minsk');
    const tokyo = formatZone('Asia/Tokyo');
    const nyc = formatZone('America/New_York');

    const elBrestTime = document.getElementById('clock-time-brest');
    const elBrestDate = document.getElementById('clock-date-brest');
    if (elBrestTime) elBrestTime.textContent = brest.time;
    if (elBrestDate) elBrestDate.textContent = brest.date;

    const elTokyoTime = document.getElementById('clock-time-tokyo');
    const elTokyoDate = document.getElementById('clock-date-tokyo');
    if (elTokyoTime) elTokyoTime.textContent = tokyo.time;
    if (elTokyoDate) elTokyoDate.textContent = tokyo.date;

    const elNycTime = document.getElementById('clock-time-nyc');
    const elNycDate = document.getElementById('clock-date-nyc');
    if (elNycTime) elNycTime.textContent = nyc.time;
    if (elNycDate) elNycDate.textContent = nyc.date;
  }

  updateWorldClocks();
  setInterval(updateWorldClocks, 1000);

  // 3. CRT Scanline Toggle
  const crtBtn = document.getElementById('btn-toggle-crt');
  if (crtBtn) {
    crtBtn.addEventListener('click', () => {
      const isDisabled = document.body.classList.toggle('crt-disabled');
      crtBtn.classList.toggle('active', !isDisabled);
      crtBtn.setAttribute('aria-pressed', (!isDisabled).toString());
      const label = crtBtn.querySelector('.btn-label');
      if (label) {
        label.textContent = isDisabled ? 'CRT: OFF' : 'CRT: ON';
      }
      if (window.soundFX) window.soundFX.playToggle(!isDisabled);
    });
  }

  // 4. Ambient Background Video Switcher
  window.setBgVideo = function(videoPath, posterPath) {
    const video = document.getElementById('site-bg-video');
    if (!video) return;
    if (posterPath) video.poster = posterPath;
    video.src = videoPath;
    video.load();
    video.play().catch(() => {});
  };

  // 4. Contact Card Copy Feedback & Live Announcer
  const liveRegion = document.getElementById('a11y-status-live');

  document.querySelectorAll('.contact-terminal-card').forEach(card => {
    const copyBtn = card.querySelector('.contact-copy-btn');
    const copyVal = card.getAttribute('data-copy');

    const handleCopy = () => {
      if (!copyVal) return;
      navigator.clipboard.writeText(copyVal).then(() => {
        if (window.soundFX) window.soundFX.playClick();
        const hint = card.querySelector('.contact-action-hint');
        if (hint) {
          const original = hint.textContent;
          hint.textContent = 'COPIED TO CLIPBOARD ✓';
          hint.style.color = 'var(--text-green)';
          setTimeout(() => {
            hint.textContent = original;
            hint.style.color = '';
          }, 1800);
        }
        if (liveRegion) {
          liveRegion.textContent = `Copied: ${copyVal}`;
          setTimeout(() => { liveRegion.textContent = ''; }, 2000);
        }
      });
    };

    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCopy();
      });
    }

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      handleCopy();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
