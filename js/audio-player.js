/* ==========================================================
   RETRO-DEV-PORTFOLIO // RETRO AUDIO PLAYER
   Reliable HTML5 Audio playback (MC Ren - I Don't Give A Damn),
   working seek bar, volume control & dynamic frequency visualizer.
   ========================================================== */

class RetroAudioPlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.animId = null;

    this.init();
  }

  init() {
    window.addEventListener('DOMContentLoaded', () => {
      this.audio = document.getElementById('main-audio-element');
      this.playBtn = document.getElementById('player-play-btn');
      this.prevBtn = document.getElementById('player-prev-btn');
      this.nextBtn = document.getElementById('player-next-btn');
      this.titleEl = document.getElementById('player-track-title');
      this.artistEl = document.getElementById('player-track-artist');
      this.timeCurrentEl = document.getElementById('player-time-current');
      this.timeDurationEl = document.getElementById('player-time-duration');
      this.seekFill = document.getElementById('player-seek-fill');
      this.seekTrack = document.getElementById('player-seek-track');
      this.volSlider = document.getElementById('player-volume-slider');
      this.visualizerBars = document.querySelectorAll('.visualizer-bar');

      // Create fallback audio object if element not found
      if (!this.audio) {
        this.audio = new Audio('assets/music/mc-ren.mp3');
      }

      // Ensure proper volume
      if (this.audio) {
        this.audio.volume = this.volSlider ? parseFloat(this.volSlider.value) : 0.8;
      }

      // Event listeners
      if (this.playBtn) {
        this.playBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.togglePlay();
        });
      }

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          if (this.audio) this.audio.currentTime = 0;
          if (window.soundFX) window.soundFX.playClick();
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          if (this.audio) {
            this.audio.currentTime = Math.min((this.audio.duration || 200) - 2, this.audio.currentTime + 15);
          }
          if (window.soundFX) window.soundFX.playClick();
        });
      }

      if (this.volSlider) {
        this.volSlider.addEventListener('input', (e) => {
          if (this.audio) {
            this.audio.volume = parseFloat(e.target.value);
          }
        });
      }

      if (this.seekTrack) {
        this.seekTrack.addEventListener('click', (e) => this.seekTo(e));
      }

      if (this.audio) {
        this.audio.addEventListener('play', () => {
          this.isPlaying = true;
          if (this.playBtn) {
            this.playBtn.innerHTML = '❚❚';
            this.playBtn.classList.add('playing');
          }
          this.startVisualizer();
        });

        this.audio.addEventListener('pause', () => {
          this.isPlaying = false;
          if (this.playBtn) {
            this.playBtn.innerHTML = '▶';
            this.playBtn.classList.remove('playing');
          }
          this.stopVisualizer();
        });

        this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());

        this.audio.addEventListener('loadedmetadata', () => {
          if (this.timeDurationEl) {
            this.timeDurationEl.textContent = this.formatTime(this.audio.duration);
          }
        });

        this.audio.addEventListener('error', (e) => {
          console.error('Audio load error, trying alternate path:', e);
          // Try original filename if alias failed
          if (!this.audio.src.includes('spaces.im.mp3')) {
            this.audio.src = 'assets/music/MC_Ren-I_Donapost_Give_A_Damn-spaces.im.mp3';
            this.audio.load();
          }
        });
      }
    });
  }

  togglePlay() {
    if (!this.audio) return;

    if (this.audio.paused) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          if (this.playBtn) {
            this.playBtn.innerHTML = '❚❚';
            this.playBtn.classList.add('playing');
          }
          this.startVisualizer();
        }).catch(err => {
          console.error('Playback failed:', err);
          // If user interaction was needed or path issue
          alert('Нажмите еще раз для запуска аудио (политика браузера)');
        });
      }
    } else {
      this.audio.pause();
      this.isPlaying = false;
      if (this.playBtn) {
        this.playBtn.innerHTML = '▶';
        this.playBtn.classList.remove('playing');
      }
      this.stopVisualizer();
    }
  }

  onTimeUpdate() {
    if (!this.audio) return;
    const cur = this.audio.currentTime;
    const dur = this.audio.duration || 1;

    if (this.timeCurrentEl) {
      this.timeCurrentEl.textContent = this.formatTime(cur);
    }
    if (this.timeDurationEl && !isNaN(dur) && dur > 1) {
      this.timeDurationEl.textContent = this.formatTime(dur);
    }
    if (this.seekFill) {
      const pct = (cur / dur) * 100;
      this.seekFill.style.width = `${pct}%`;
    }
  }

  seekTo(e) {
    if (!this.audio || !this.seekTrack) return;
    const rect = this.seekTrack.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.audio.currentTime = percent * (this.audio.duration || 1);
  }

  startVisualizer() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const updateBars = () => {
      if (!this.isPlaying) return;

      const t = Date.now() / 80;
      if (this.visualizerBars) {
        this.visualizerBars.forEach((bar, i) => {
          // Dynamic rhythm wave pattern
          const h = 18 + Math.floor(
            Math.sin(t * 1.4 + i * 0.45) * 30 +
            Math.cos(t * 0.7 - i * 0.3) * 20 +
            Math.random() * 30
          );
          bar.style.height = `${Math.min(100, Math.max(10, h))}%`;
        });
      }

      this.animId = requestAnimationFrame(updateBars);
    };

    this.animId = requestAnimationFrame(updateBars);
  }

  stopVisualizer() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.visualizerBars) {
      this.visualizerBars.forEach(bar => {
        bar.style.height = '10%';
      });
    }
  }

  formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}

window.retroAudioPlayer = new RetroAudioPlayer();
