/* ==========================================================
   RETRO-DEV-PORTFOLIO // MAIN APPLICATION COORDINATOR
   Theme dropdown switcher, CRT toggle, copy feedback & a11y
   ========================================================== */

function initApp() {
  // 1. Theme Dropdown Switcher
  const themeSelect = document.getElementById('theme-selector');
  const allThemes = [
    'theme-obsidian',
    'theme-green-crt',
    'theme-atari',
    'theme-cyberpunk',
    'theme-amber',
    'theme-win98',
    'theme-virtualboy'
  ];

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      allThemes.forEach(t => document.body.classList.remove(t));

      if (selected !== 'theme-obsidian') {
        document.body.classList.add(selected);
      }

      if (window.bgEngine && typeof window.bgEngine.setTheme === 'function') {
        window.bgEngine.setTheme(selected);
      }

      if (window.soundFX) window.soundFX.playToggle(true);
    });
  }

  // 2. CRT Scanline Toggle
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

  // 3. Contact Card Copy Feedback & Live Announcer
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
          liveRegion.textContent = `Скопировано: ${copyVal}`;
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
      // If clicking link inside card, let link navigate
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
