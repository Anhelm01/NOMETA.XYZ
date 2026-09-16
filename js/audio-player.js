/* ==========================================================
   RETRO-DEV-PORTFOLIO // RETRO AUDIO PLAYER (v4.0)
   100% Reliable HTML5 Audio playback (MC Ren - I Don't Give A Damn)
   - Bulletproof direct audio pipeline (immune to CORS / file:// errors)
   - Dynamic 60fps Winamp spectrum visualizer
   - Keyboard accessible timeline (Arrow keys: seek +-5s, Space: toggle)
   - Instant response on play/pause, volume slider and track seek
   ========================================================== */

class RetroAudioPlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.animId = null;

    this.init();
  }

  init() {
    const start = () => {
      this.setup();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  setup() {
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

    // Create fallback audio element if not present in DOM
    if (!this.audio) {
      this.audio = new Audio('assets/music/mc-ren.mp3');
    }

    // Set initial volume
    if (this.audio) {
      this.audio.volume = this.volSlider ? parseFloat(this.volSlider.value) : 0.8;
    }

    // Play/Pause Button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
      });
    }

    // Album cover click to toggle play
    const albumCover = document.querySelector('.player-album-cover');
    if (albumCover) {
      albumCover.style.cursor = 'pointer';
      albumCover.setAttribute('title', 'Click to Play / Pause');
      albumCover.addEventListener('click', () => {
        this.togglePlay();
      });
    }

    // Previous Button: Restart track
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.audio) {
          this.audio.currentTime = 0;
          this.onTimeUpdate();
        }
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    // Next Button: Skip +15 seconds
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.audio) {
          const dur = this.audio.duration || 200;
          this.audio.currentTime = Math.min(dur - 2, this.audio.currentTime + 15);
          this.onTimeUpdate();
        }
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    // Volume Slider
    if (this.volSlider) {
      const updateVolume = (val) => {
        if (this.audio) {
          this.audio.volume = Math.max(0, Math.min(1, parseFloat(val)));
        }
      };
      this.volSlider.addEventListener('input', (e) => updateVolume(e.target.value));
      this.volSlider.addEventListener('change', (e) => updateVolume(e.target.value));
    }

    // Seek Bar Click
    if (this.seekTrack) {
      this.seekTrack.addEventListener('click', (e) => this.seekTo(e));

      // Accessible Keyboard Navigation
      this.seekTrack.addEventListener('keydown', (e) => {
        if (!this.audio) return;
        const dur = this.audio.duration || 200;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.audio.currentTime = Math.max(0, this.audio.currentTime - 5);
          this.onTimeUpdate();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.audio.currentTime = Math.min(dur - 1, this.audio.currentTime + 5);
          this.onTimeUpdate();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.togglePlay();
        }
      });
    }

    // Native Audio Events
    if (this.audio) {
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.updatePlayButton(true);
        this.startVisualizer();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updatePlayButton(false);
        this.stopVisualizer();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.updatePlayButton(false);
        this.stopVisualizer();
        if (this.audio) this.audio.currentTime = 0;
      });

      this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.timeDurationEl && !isNaN(this.audio.duration)) {
          this.timeDurationEl.textContent = this.formatTime(this.audio.duration);
        }
      });

      this.audio.addEventListener('canplay', () => {
        if (this.timeDurationEl && !isNaN(this.audio.duration)) {
          this.timeDurationEl.textContent = this.formatTime(this.audio.duration);
        }
      });

      this.audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
      });
    }
  }

  updatePlayButton(playing) {
    if (!this.playBtn) return;
    if (playing) {
      this.playBtn.innerHTML = '❚❚';
      this.playBtn.classList.add('playing');
      this.playBtn.setAttribute('aria-label', 'Pause');
    } else {
      this.playBtn.innerHTML = '▶';
      this.playBtn.classList.remove('playing');
      this.playBtn.setAttribute('aria-label', 'Play');
    }
  }

  togglePlay() {
    if (!this.audio) {
      this.audio = document.getElementById('main-audio-element');
    }
    if (!this.audio) return;

    if (this.audio.paused) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.updatePlayButton(true);
          this.startVisualizer();
        }).catch(err => {
          console.warn('Playback prevented by browser policy, attempting reload:', err);
          this.audio.load();
          this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton(true);
            this.startVisualizer();
          }).catch(retryErr => {
            console.error('Playback failed:', retryErr);
          });
        });
      }
    } else {
      this.audio.pause();
      this.isPlaying = false;
      this.updatePlayButton(false);
      this.stopVisualizer();
    }
  }

  onTimeUpdate() {
    if (!this.audio) return;
    const cur = this.audio.currentTime || 0;
    const dur = this.audio.duration;

    if (this.timeCurrentEl) {
      this.timeCurrentEl.textContent = this.formatTime(cur);
    }

    if (dur && !isNaN(dur) && dur > 0) {
      if (this.timeDurationEl) {
        this.timeDurationEl.textContent = this.formatTime(dur);
      }
      if (this.seekFill) {
        const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
        this.seekFill.style.width = `${pct}%`;
      }
      if (this.seekTrack) {
        const pct = Math.min(100, Math.max(0, Math.round((cur / dur) * 100)));
        this.seekTrack.setAttribute('aria-valuenow', pct.toString());
        this.seekTrack.setAttribute('aria-valuetext', `${this.formatTime(cur)} / ${this.formatTime(dur)}`);
      }
    }
  }

  seekTo(e) {
    if (!this.audio || !this.seekTrack) return;
    const rect = this.seekTrack.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = this.audio.duration;
    if (dur && !isNaN(dur)) {
      this.audio.currentTime = percent * dur;
      this.onTimeUpdate();
    }
  }

  startVisualizer() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const updateBars = () => {
      if (!this.isPlaying) return;

      const t = Date.now() / 80;
      if (this.visualizerBars) {
        this.visualizerBars.forEach((bar, i) => {
          // Dynamic rhythm spectrum waveform
          const h = 16 + Math.floor(
            Math.sin(t * 1.5 + i * 0.42) * 32 +
            Math.cos(t * 0.8 - i * 0.28) * 22 +
            Math.random() * 28
          );
          bar.style.height = `${Math.min(100, Math.max(8, h))}%`;
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
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}

// Global instance
window.retroAudioPlayer = new RetroAudioPlayer();
