/* ==========================================================
   RETRO-DEV-PORTFOLIO // MAIN APPLICATION COORDINATOR
   Theme dropdown switcher, CRT toggle, copy feedback
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
      const label = crtBtn.querySelector('.btn-label');
      if (label) {
        label.textContent = isDisabled ? 'CRT: OFF' : 'CRT: ON';
      }
      if (window.soundFX) window.soundFX.playToggle(!isDisabled);
    });
  }

  // 3. Contact Card Copy Feedback
  document.querySelectorAll('.contact-terminal-card').forEach(card => {
    card.addEventListener('click', () => {
      const copyVal = card.getAttribute('data-copy');
      if (copyVal) {
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
        });
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
