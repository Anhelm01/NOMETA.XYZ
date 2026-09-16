/* ==========================================================
   RETRO-DEV-PORTFOLIO // WINDOWS 98 CHAOS POPUPS (v3.2)
   Exact user phrases from updated errors.txt + random positions.
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

window.spawnCascadingDialogs = function() {
  const container = document.getElementById('cascade-container');
  if (!container) return;

  container.innerHTML = '';
  const total = customErrorPhrases.length;
  const shuffledPhrases = shuffle(customErrorPhrases);
  const iconKeys = ['warning', 'critical', 'info', 'bomb'];

  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const phrase = shuffledPhrases[i % shuffledPhrases.length];
      const iconKey = iconKeys[i % iconKeys.length];
      const iconSvg = retroIcons[iconKey];
      const winTitle = windowTitles[i % windowTitles.length];

      const dialog = document.createElement('div');
      dialog.className = 'cascade-dialog';

      // Random position across viewport with safe margins
      const maxW = Math.max(60, window.innerWidth - 320);
      const maxH = Math.max(60, window.innerHeight - 170);
      const randX = Math.floor(Math.random() * maxW);
      const randY = Math.floor(Math.random() * maxH);

      dialog.style.left = `${randX}px`;
      dialog.style.top = `${randY}px`;
      dialog.style.zIndex = 2000 + i;

      dialog.innerHTML = `
        <div class="cascade-titlebar">
          <span>${winTitle}</span>
          <span class="cascade-close" onclick="this.closest('.cascade-dialog').remove()">✕</span>
        </div>
        <div class="cascade-body">
          <div class="cascade-icon-box">${iconSvg}</div>
          <div class="cascade-text">
            <strong>${phrase}</strong><br>
            <span class="cascade-meta">STYLE_VAL: 200 // ADDR: 0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}</span>
          </div>
        </div>
        <div class="cascade-footer">
          <button class="cascade-btn" onclick="document.getElementById('cascade-container').innerHTML=''">OK (Закрыть всё)</button>
        </div>
      `;

      container.appendChild(dialog);
      makeCascadeDialogDraggable(dialog);
      if (window.soundFX && i % 4 === 0) window.soundFX.playBeep();
    }, i * 35);
  }
};

// --- DRAGGABLE WINDOW SYSTEM ---
let topZIndex = 50;

function initDraggableWindows() {
  const windows = document.querySelectorAll('.retro-window');

  windows.forEach(win => {
    const titlebar = win.querySelector('.window-titlebar');
    if (!titlebar) return;

    // Bring to front when clicked anywhere in the window
    win.addEventListener('pointerdown', () => {
      topZIndex++;
      win.style.zIndex = topZIndex;
    });

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialTransX = 0;
    let initialTransY = 0;

    titlebar.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking buttons, links or icons
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
      const currentX = initialTransX + dx;
      const currentY = initialTransY + dy;

      win.style.transform = `translate(${currentX}px, ${currentY}px)`;
      win.setAttribute('data-trans-x', currentX);
      win.setAttribute('data-trans-y', currentY);
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

    // Double click titlebar to reset window position back to original slot
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

function makeCascadeDialogDraggable(dialog) {
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
    if (e.target.closest('button') || e.target.closest('span:last-child')) return;
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
    dialog.style.left = `${initLeft + dx}px`;
    dialog.style.top = `${initTop + dy}px`;
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

function initWindows() {
  // Initialize draggable retro windows
  initDraggableWindows();

  // 1. Click on retro icon in window titlebars or taskbar brand
  document.querySelectorAll('.window-icon, .taskbar-brand').forEach(el => {
    el.style.cursor = 'pointer';
    el.removeAttribute('title');
    el.addEventListener('click', () => {
      window.spawnCascadingDialogs();
    });
  });

  // 2. Secret Hotkey 'e'
  document.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'у') {
      window.spawnCascadingDialogs();
    }
  });

  // Window Minimize / Close buttons
  document.querySelectorAll('.win-btn.close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const win = e.target.closest('.retro-window');
      if (win) {
        if (window.soundFX) window.soundFX.playClick();
        win.style.transition = 'opacity 0.2s ease';
        win.style.opacity = '0';
        setTimeout(() => win.style.display = 'none', 200);
      }
    });
  });

  document.querySelectorAll('.win-btn.min').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const win = e.target.closest('.retro-window');
      if (win) {
        if (window.soundFX) window.soundFX.playClick();
        const body = win.querySelector('.window-body');
        if (body) {
          body.style.display = body.style.display === 'none' ? 'block' : 'none';
        }
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWindows);
} else {
  initWindows();
}
