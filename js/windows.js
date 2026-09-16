/* ==========================================================
   RETRO-DEV-PORTFOLIO // RETRO WINDOWS & CHAOS DIALOGS (v4.0)
   - Mobile touch-safe (native vertical scrolling guaranteed)
   - Desktop viewport clamping on draggable windows
   - Functional Maximize, Minimize, Close & Taskbar Restore
   - Interactive Project Filters
   - Secure DOM construction (Zero DOM-XSS risks)
   ========================================================== */

let customErrorPhrases = [
  "Ошибка. Ваш стиль теперь 200",
  "Ошибка. Жаренные гвозди",
  "Ошибка. Цену на Чапман подняли",
  "Ошибка. Браузер не поддерживает Pepsiman.sys.",
  "Ошибка 102. Нам мама запрещает с такими общаться",
  "Ошибка 404. Жареные гвозди не обнаружены",
  "Ошибка 502. Вы уронили сосиску на ковер",
  "Фатальный сбой. Мама перегрызла телефонный провод",
  "Ошибка 777. Превышен лимит стиля на квадратный метр",
  "Ошибка. Дискету зажевало пятилетним ребенком.",
  "Ошибка. Передайте за проезд или выйдите из системы",
  "Системное уведомление: MC Ren заблокировал Windows",
  "Ошибка 98. Мужики на заводе не поймут",
  "Ошибка. Обнаружен несанкционированный еврей",
  "Критический сбой. Розовая Пантера отказалась давать показания",
  "Ошибка 0x000. Вставьте картридж до щелчка",
  "Ошибка. Шаман вступил в Организацию XIII",
  "Ошибка. Рыцарь допил сок «Добрый» без трубочки",
  "Ошибка 666. Фиксиков убило ещё при входе.",
  "Системная ошибка. Уровень увлажнения повышен до максимума",
  "Ошибка. Windows хочет спать",
  "Ошибка 418. Я чайник, а не сервер",
  "Ошибка. Вы забыли продуть картридж перед запуском",
  "Сбой 1993. Кассета размоталась, мотайте карандашом",
  "Ошибка 999. Мне ещё не скинули cash на лечение",
  "Критическая ошибка. Алло, это прачечная?",
  "Ошибка. Не трогай, это на Новый год",
  "Ошибка 1337. Доступ разрешен только GAYS",
  "Ошибка. Часы удалили, живите вечно",
  "Ошибка. Системный блок гудит громче самолета",
  "Ошибка. Алло, полиция? Тут слишком много cookies"
];

// Try reading dynamic updates from assets/errors.txt if served via HTTP
fetch('assets/errors.txt')
  .then(res => res.ok ? res.text() : Promise.reject())
  .then(text => {
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('Могут быть'));
    if (lines.length > 0) {
      customErrorPhrases = lines;
    }
  })
  .catch(() => {});

// Pixel Art SVGs for Dialogs (Zero Emojis)
const retroIcons = {
  warning: `<svg width="32" height="32" viewBox="0 0 16 16" style="shape-rendering:crispEdges;flex-shrink:0;">
    <polygon points="8,1 15,14 1,14" fill="#facc15" stroke="#000" stroke-width="1"/>
    <rect x="7.2" y="5" width="1.6" height="5" fill="#000"/>
    <rect x="7.2" y="11.2" width="1.6" height="1.6" fill="#000"/>
  </svg>`,
  critical: `<svg width="32" height="32" viewBox="0 0 16 16" style="shape-rendering:crispEdges;flex-shrink:0;">
    <circle cx="8" cy="8" r="7" fill="#dc2626" stroke="#000" stroke-width="1"/>
    <line x1="4.5" y1="4.5" x2="11.5" y2="11.5" stroke="#fff" stroke-width="2"/>
    <line x1="11.5" y1="4.5" x2="4.5" y2="11.5" stroke="#fff" stroke-width="2"/>
  </svg>`,
  info: `<svg width="32" height="32" viewBox="0 0 16 16" style="shape-rendering:crispEdges;flex-shrink:0;">
    <circle cx="8" cy="8" r="7" fill="#2563eb" stroke="#000" stroke-width="1"/>
    <rect x="7" y="3.5" width="2" height="2" fill="#fff"/>
    <rect x="7" y="7" width="2" height="5.5" fill="#fff"/>
  </svg>`,
  bomb: `<svg width="32" height="32" viewBox="0 0 16 16" style="shape-rendering:crispEdges;flex-shrink:0;">
    <circle cx="7.5" cy="9.5" r="5.5" fill="#111" stroke="#333" stroke-width="0.5"/>
    <rect x="7" y="2.5" width="1.5" height="2" fill="#888"/>
    <path d="M8 2.5 C10 1 12 2 13 1" stroke="#f59e0b" fill="none" stroke-width="1.2"/>
  </svg>`
};

const windowTitles = [
  "Ошибка // Win98.sys",
  "Критический сбой системы",
  "Предупреждение 0x1993",
  "Pepsiman.sys Alert",
  "Ruthless Security Exception",
  "Служба стиля Windows",
  "Фатальный сбой памяти",
  "Внимание! Нештатная ситуация"
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isMobileDevice() {
  return window.innerWidth <= 768 || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
}

// Global top z-index for active window stacking
let topZIndex = 50;

// --- 1. WINDOWS 98 CHAOS POPUPS (SAFE DOM & MAX 10 LIMIT) ---
window.spawnCascadingDialogs = function() {
  const container = document.getElementById('cascade-container');
  if (!container) return;

  const maxDialogs = 10;
  const shuffledPhrases = shuffle(customErrorPhrases);
  const iconKeys = ['warning', 'critical', 'info', 'bomb'];
  const countToSpawn = Math.min(8, shuffledPhrases.length);

  for (let i = 0; i < countToSpawn; i++) {
    setTimeout(() => {
      // Keep DOM clean by removing older dialogs
      while (container.children.length >= maxDialogs) {
        if (container.firstElementChild) {
          container.firstElementChild.remove();
        }
      }

      const phrase = shuffledPhrases[i % shuffledPhrases.length];
      const iconKey = iconKeys[i % iconKeys.length];
      const winTitle = windowTitles[i % windowTitles.length];

      const dialog = document.createElement('div');
      dialog.className = 'cascade-dialog';

      // Safe viewport positions
      const maxW = Math.max(30, window.innerWidth - 300);
      const maxH = Math.max(30, window.innerHeight - 170);
      const randX = Math.floor(Math.random() * maxW);
      const randY = Math.floor(Math.random() * maxH);

      dialog.style.left = `${randX}px`;
      dialog.style.top = `${randY}px`;
      topZIndex++;
      dialog.style.zIndex = topZIndex;

      // Titlebar
      const titlebar = document.createElement('div');
      titlebar.className = 'cascade-titlebar';
      const titleSpan = document.createElement('span');
      titleSpan.textContent = winTitle;
      const closeSpan = document.createElement('span');
      closeSpan.className = 'cascade-close';
      closeSpan.textContent = '✕';
      closeSpan.setAttribute('role', 'button');
      closeSpan.setAttribute('aria-label', 'Закрыть окно');
      closeSpan.addEventListener('click', () => dialog.remove());
      titlebar.appendChild(titleSpan);
      titlebar.appendChild(closeSpan);

      // Body
      const body = document.createElement('div');
      body.className = 'cascade-body';

      const iconBox = document.createElement('div');
      iconBox.className = 'cascade-icon-box';
      iconBox.innerHTML = retroIcons[iconKey] || '';

      const textBox = document.createElement('div');
      textBox.className = 'cascade-text';
      const strong = document.createElement('strong');
      strong.textContent = phrase;
      const br = document.createElement('br');
      const metaSpan = document.createElement('span');
      metaSpan.className = 'cascade-meta';
      const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
      metaSpan.textContent = `STYLE_VAL: 200 // ADDR: 0x${randomHex}`;

      textBox.appendChild(strong);
      textBox.appendChild(br);
      textBox.appendChild(metaSpan);

      body.appendChild(iconBox);
      body.appendChild(textBox);

      // Footer
      const footer = document.createElement('div');
      footer.className = 'cascade-footer';
      const okBtn = document.createElement('button');
      okBtn.className = 'cascade-btn';
      okBtn.textContent = 'OK (Закрыть)';
      okBtn.addEventListener('click', () => dialog.remove());
      footer.appendChild(okBtn);

      dialog.appendChild(titlebar);
      dialog.appendChild(body);
      dialog.appendChild(footer);

      container.appendChild(dialog);
      makeCascadeDialogDraggable(dialog);
      if (window.soundFX && i % 3 === 0) window.soundFX.playBeep();
    }, i * 40);
  }
};

function makeCascadeDialogDraggable(dialog) {
  if (isMobileDevice()) return;

  const titlebar = dialog.querySelector('.cascade-titlebar');
  if (!titlebar) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initLeft = 0;
  let initTop = 0;

  dialog.addEventListener('pointerdown', () => {
    topZIndex++;
    dialog.style.zIndex = topZIndex;
  });

  titlebar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('.cascade-close')) return;
    isDragging = true;
    try {
      titlebar.setPointerCapture(e.pointerId);
    } catch (err) {}

    document.body.classList.add('is-window-dragging');
    topZIndex++;
    dialog.style.zIndex = topZIndex;

    startX = e.clientX;
    startY = e.clientY;
    initLeft = dialog.offsetLeft;
    initTop = dialog.offsetTop;
  });

  titlebar.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = Math.max(10, Math.min(window.innerWidth - 80, initLeft + dx));
    const newTop = Math.max(10, Math.min(window.innerHeight - 60, initTop + dy));
    dialog.style.left = `${newLeft}px`;
    dialog.style.top = `${newTop}px`;
  });

  const stop = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try {
      titlebar.releasePointerCapture(e.pointerId);
    } catch (err) {}
    document.body.classList.remove('is-window-dragging');
  };

  titlebar.addEventListener('pointerup', stop);
  titlebar.addEventListener('pointercancel', stop);
}

// --- 2. DRAGGABLE WINDOW SYSTEM (DESKTOP ONLY + CLAMPED) ---
function initDraggableWindows() {
  const windows = document.querySelectorAll('.retro-window');

  windows.forEach(win => {
    const titlebar = win.querySelector('.window-titlebar');
    if (!titlebar) return;

    // Bring to front on pointerdown
    win.addEventListener('pointerdown', () => {
      topZIndex++;
      win.style.zIndex = topZIndex;
    });

    // On mobile or touch screens, skip dragging so native scroll is 100% free
    if (isMobileDevice()) {
      return;
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialTransX = 0;
    let initialTransY = 0;

    titlebar.addEventListener('pointerdown', (e) => {
      // Don't drag on mobile or if window is maximized or clicking controls
      if (isMobileDevice() || win.classList.contains('is-maximized')) return;
      if (e.target.closest('.win-btn') || e.target.closest('.window-icon') || e.target.closest('button') || e.target.closest('a')) {
        return;
      }

      isDragging = true;
      try {
        titlebar.setPointerCapture(e.pointerId);
      } catch (err) {}

      document.body.classList.add('is-window-dragging');
      topZIndex++;
      win.style.zIndex = topZIndex;

      startX = e.clientX;
      startY = e.clientY;
      initialTransX = parseFloat(win.getAttribute('data-trans-x') || '0');
      initialTransY = parseFloat(win.getAttribute('data-trans-y') || '0');
    });

    titlebar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Clamping so window titlebar never leaves viewport
      const currentX = initialTransX + dx;
      const currentY = initialTransY + dy;

      const rect = win.getBoundingClientRect();
      const minX = -rect.left + 20;
      const maxX = window.innerWidth - rect.right - 20;
      const minY = -rect.top + 10;
      const maxY = window.innerHeight - rect.top - 40;

      const clampedX = Math.max(minX, Math.min(maxX, currentX));
      const clampedY = Math.max(minY, Math.min(maxY, currentY));

      win.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      win.setAttribute('data-trans-x', clampedX);
      win.setAttribute('data-trans-y', clampedY);
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        titlebar.releasePointerCapture(e.pointerId);
      } catch (err) {}
      document.body.classList.remove('is-window-dragging');
    };

    titlebar.addEventListener('pointerup', stopDrag);
    titlebar.addEventListener('pointercancel', stopDrag);

    // Double click titlebar resets window position
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.win-btn') || e.target.closest('.window-icon')) return;
      win.style.transition = 'transform 0.25s ease';
      win.style.transform = 'translate(0px, 0px)';
      win.setAttribute('data-trans-x', '0');
      win.setAttribute('data-trans-y', '0');
      setTimeout(() => {
        win.style.transition = '';
      }, 250);
      if (window.soundFX) window.soundFX.playClick();
    });
  });
}

// --- 3. WINDOW CONTROLS (MIN, MAX, CLOSE & RESTORE) ---
function initWindowControls() {
  // Maximize / Restore button
  document.querySelectorAll('.win-btn.max').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const win = e.target.closest('.retro-window');
      if (!win) return;
      if (window.soundFX) window.soundFX.playClick();

      const isMax = win.classList.toggle('is-maximized');
      btn.textContent = isMax ? '❐' : '□';
      btn.setAttribute('aria-label', isMax ? 'Восстановить размер' : 'Развернуть на весь экран');

      if (isMax) {
        win.style.transform = 'none';
      } else {
        const tx = win.getAttribute('data-trans-x') || '0';
        const ty = win.getAttribute('data-trans-y') || '0';
        win.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    });
  });

  // Minimize button (collapses window body)
  document.querySelectorAll('.win-btn.min').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const win = e.target.closest('.retro-window');
      if (!win) return;
      if (window.soundFX) window.soundFX.playClick();

      const body = win.querySelector('.window-body');
      const menubar = win.querySelector('.window-menubar');
      const isMinimized = win.classList.toggle('is-minimized');

      if (body) body.style.display = isMinimized ? 'none' : '';
      if (menubar) menubar.style.display = isMinimized ? 'none' : '';
      btn.setAttribute('aria-expanded', !isMinimized);
    });
  });

  // Close button (hides window, restorable via taskbar)
  document.querySelectorAll('.win-btn.close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const win = e.target.closest('.retro-window');
      if (!win) return;
      if (window.soundFX) window.soundFX.playClick();

      win.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      win.style.opacity = '0';
      win.style.transform = 'scale(0.96)';
      setTimeout(() => {
        win.classList.add('is-closed');
        win.style.display = 'none';
        win.style.opacity = '';
        win.style.transform = '';
        win.style.transition = '';
      }, 200);
    });
  });

  // Taskbar nav click restores closed windows and scrolls smoothly
  document.querySelectorAll('.taskbar-nav .nav-icon-btn').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const win = document.querySelector(targetId);
      if (!win) return;

      // If closed, restore it!
      if (win.classList.contains('is-closed') || win.style.display === 'none') {
        win.classList.remove('is-closed');
        win.style.display = '';
        win.style.opacity = '0';
        win.style.transition = 'opacity 0.25s ease';
        requestAnimationFrame(() => {
          win.style.opacity = '1';
        });
        setTimeout(() => { win.style.transition = ''; }, 250);
      }

      // If minimized, unminimize it!
      if (win.classList.contains('is-minimized')) {
        win.classList.remove('is-minimized');
        const body = win.querySelector('.window-body');
        const menubar = win.querySelector('.window-menubar');
        if (body) body.style.display = '';
        if (menubar) menubar.style.display = '';
        const minBtn = win.querySelector('.win-btn.min');
        if (minBtn) minBtn.setAttribute('aria-expanded', 'true');
      }

      topZIndex++;
      win.style.zIndex = topZIndex;
    });
  });
}

// --- 4. INTERACTIVE PROJECT FILTER BAR ---
function initProjectFilters() {
  const filterBar = document.querySelector('.project-filter-bar');
  if (!filterBar) return;

  const buttons = filterBar.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (window.soundFX) window.soundFX.playClick();

      cards.forEach(card => {
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        if (filter === 'all' || cat.includes(filter.toLowerCase())) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(6px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            card.style.opacity = '1';
            card.style.transform = 'none';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- 5. INITIALIZATION ---
function initWindows() {
  initDraggableWindows();
  initWindowControls();
  initProjectFilters();

  // Window icons and taskbar brand trigger chaos dialogs
  document.querySelectorAll('.window-icon, .taskbar-brand').forEach(el => {
    el.style.cursor = 'pointer';
    el.removeAttribute('title');
    el.addEventListener('click', () => {
      window.spawnCascadingDialogs();
    });
  });

  // Secret Hotkey 'e' / 'у' (ignores inputs and modifier keys)
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.matches('input, textarea, select, [contenteditable]') || e.target.isContentEditable)) {
      return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У') {
      window.spawnCascadingDialogs();
    }
  });

  // Handle window resize dynamically
  window.addEventListener('resize', () => {
    if (isMobileDevice()) {
      document.querySelectorAll('.retro-window').forEach(win => {
        if (!win.classList.contains('is-maximized')) {
          win.style.transform = 'none';
        }
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWindows);
} else {
  initWindows();
}
