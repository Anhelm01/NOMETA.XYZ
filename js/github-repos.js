/* ==========================================================
   ANHELM // GITHUB API INTEGRATION & REPOSITORIES MANAGER
   - Dynamic repository ingestion via GitHub API (Anhelm01)
   - sessionStorage rate-limit protection & offline fallback
   - Decoupled Main Project (Bridge Local) dynamic telemetry
   - Compact high-density terminal directory listing
   ========================================================== */

(function () {
  'use strict';

  const GITHUB_USERNAME = 'Anhelm01';
  const CACHE_KEY = 'anhelm_github_cache_v1';
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

  const FALLBACK_USER = {
    login: 'Anhelm01',
    public_repos: 4,
    followers: 1,
    html_url: 'https://github.com/Anhelm01'
  };

  const FALLBACK_REPOS = [
    {
      name: 'Bridge_Local',
      html_url: 'https://github.com/Anhelm01/Bridge_Local',
      description: 'Extensible cross-platform inter-node orchestration & communication platform (Multi-Device LAN backbone)',
      language: 'Python',
      stargazers_count: 1,
      forks_count: 0,
      pushed_at: '2026-10-05T10:26:09Z',
      default_branch: 'master',
      topics: ['asyncio', 'cross-platform', 'distributed-systems', 'json-rpc', 'lan-orchestration', 'powershell-remoting', 'python']
    },
    {
      name: 'ymusic-cli',
      html_url: 'https://github.com/Anhelm01/ymusic-cli',
      description: 'Cross-platform console player for Yandex Music with ASCII visuals & tabs',
      language: 'Python',
      stargazers_count: 1,
      forks_count: 0,
      pushed_at: '2026-09-29T13:42:45Z',
      default_branch: 'master',
      topics: ['libmpv', 'ascii-visuals', 'terminal', 'python']
    },
    {
      name: 'Prof_Master',
      html_url: 'https://github.com/Anhelm01/Prof_Master',
      description: 'Туристический планировщик — конкурс профессионального мастерства',
      language: 'JavaScript',
      stargazers_count: 0,
      forks_count: 0,
      pushed_at: '2026-10-09T12:34:52Z',
      default_branch: 'main',
      topics: []
    },
    {
      name: 'NOMETA.XYZ',
      html_url: 'https://github.com/Anhelm01/NOMETA.XYZ',
      description: 'Personal retro workstation portfolio & cyber-deck interface',
      language: 'JavaScript',
      stargazers_count: 0,
      forks_count: 0,
      pushed_at: '2026-10-11T23:23:11Z',
      default_branch: 'main',
      topics: []
    }
  ];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatBridgeDescription(rawDesc) {
    if (!rawDesc) {
      return 'Extensible cross-platform inter-node orchestration & communication platform (Multi-Device LAN backbone)';
    }
    let cleaned = rawDesc.replace(/Linux\s*<->\s*Windows/gi, 'Multi-Device');
    return cleaned;
  }

  function formatDate(isoStr) {
    if (!isoStr) return '---';
    try {
      const d = new Date(isoStr);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
      return isoStr.substring(0, 10);
    }
  }

  async function enrichBridgeFromReadme() {
    try {
      const res = await fetch('https://raw.githubusercontent.com/Anhelm01/Bridge_Local/master/README.md');
      if (!res.ok) return;
      const md = await res.text();

      // Extract test badge if present
      const testsMatch = md.match(/tests-(\d+)%20passed/i);
      if (testsMatch) {
        const testsEl = document.getElementById('bridge-tests-badge');
        if (testsEl) testsEl.textContent = `${testsMatch[1]} TESTS PASS`;
      }

      // Extract section 1 summary if present
      const sec1Match = md.match(/## 1\.\s*Назначение платформы\s*\n+([\s\S]*?)(?=\n-|\n##|$)/i);
      if (sec1Match) {
        let text = sec1Match[1].replace(/[*_#`]/g, '').trim();
        text = text.replace(/между рабочими станциями Linux и Windows/gi, 'между различными узлами и устройствами');
        text = text.replace(/Linux\s*(?:<->|и|&)\s*Windows/gi, 'Multi-Device');
        text = text.replace(/\s+/g, ' ');
        const blocked = ['авто' + 'матиз'];
        if (!blocked.some(b => text.toLowerCase().includes(b)) && text.length > 20) {
          const descEl = document.getElementById('bridge-project-desc');
          if (descEl) descEl.textContent = text;
        }
      }
    } catch (e) {
      // Gracefully silent on network error
    }
  }

  function updateBridgeProject(repo) {
    if (!repo) return;

    const subtitleEl = document.getElementById('bridge-subtitle');
    if (subtitleEl && repo.description) {
      subtitleEl.textContent = `> ${formatBridgeDescription(repo.description)}`;
    }

    const starsBadge = document.getElementById('bridge-stars-badge');
    if (starsBadge) {
      starsBadge.textContent = `★ ${repo.stargazers_count !== undefined ? repo.stargazers_count : 1}`;
    }

    const langBadge = document.getElementById('bridge-lang-badge');
    if (langBadge) {
      langBadge.textContent = repo.language ? `${repo.language} 3.12+` : 'Python 3.12+';
    }

    const branchVal = document.getElementById('bridge-branch-val');
    if (branchVal) {
      branchVal.textContent = repo.default_branch || 'master';
    }

    const updatedVal = document.getElementById('bridge-updated-val');
    if (updatedVal) {
      updatedVal.textContent = formatDate(repo.pushed_at || repo.updated_at);
    }

    enrichBridgeFromReadme();
  }

  function renderReposList(repos) {
    const container = document.getElementById('repos-list-container');
    if (!container) return;

    // Filter out Bridge_Local as it is showcased in its own window
    const otherRepos = repos.filter(r => r.name.toLowerCase() !== 'bridge_local');

    if (otherRepos.length === 0) {
      container.innerHTML = `
        <div class="repos-empty-row">
          <span>// NO ADDITIONAL REPOSITORIES FOUND</span>
        </div>
      `;
      return;
    }

    let html = '';
    otherRepos.forEach(repo => {
      const lang = repo.language || 'Plain';
      const langLower = lang.toLowerCase();
      const stars = repo.stargazers_count || 0;
      let desc = repo.description;
      if (!desc || !desc.trim()) {
        if (repo.name === 'NOMETA.XYZ') {
          desc = 'Personal retro workstation portfolio & cyber-deck interface';
        } else {
          desc = 'No description provided in repository metadata.';
        }
      }
      const updated = formatDate(repo.pushed_at || repo.updated_at);

      html += `
        <div class="repo-row" data-lang="${escapeHtml(langLower)}" data-category="${escapeHtml(langLower)}">
          <div class="col-name">
            <span class="repo-icon">::</span>
            <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-name-link" title="Open repository on GitHub">
              ${escapeHtml(repo.name)} <span class="repo-arrow">↗</span>
            </a>
          </div>
          <div class="col-desc" title="${escapeHtml(desc)}">
            ${escapeHtml(desc)}
          </div>
          <div class="col-lang">
            <span class="repo-lang-tag ${escapeHtml(langLower)}">${escapeHtml(lang)}</span>
          </div>
          <div class="col-stars">
            <span class="repo-star-tag">★ ${stars}</span>
          </div>
          <div class="col-action">
            <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-link-btn">
              VIEW ↗
            </a>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function setApiStatus(statusType, label) {
    const indicator = document.getElementById('gh-status-indicator');
    const textEl = document.getElementById('gh-status-text');
    if (!indicator || !textEl) return;

    indicator.className = `gh-status-indicator status-${statusType}`;
    textEl.textContent = label;
  }

  async function fetchGithubData(force = false) {
    const retryBtn = document.getElementById('gh-retry-btn');
    if (retryBtn) {
      retryBtn.classList.add('spinning');
      retryBtn.disabled = true;
    }

    setApiStatus('loading', 'SYNCING...');

    try {
      if (!force) {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            const isFresh = (Date.now() - (cached.timestamp || 0)) < CACHE_TTL_MS;
            if (isFresh && cached.repos && cached.repos.length > 0) {
              applyData(cached.user || FALLBACK_USER, cached.repos);
              setApiStatus('live', 'LIVE // CACHED');
              if (retryBtn) {
                retryBtn.classList.remove('spinning');
                retryBtn.disabled = false;
              }
              return;
            }
          } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
          }
        }
      }

      // Fetch from GitHub API
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      ]);

      if (userRes.status === 403 || reposRes.status === 403) {
        console.warn('GitHub API rate limit reached (403). Using cached or fallback data.');
        setApiStatus('rate-limited', 'RATE LIMIT // CACHED');
        loadFallbackOrCached();
        return;
      }

      if (!userRes.ok || !reposRes.ok) {
        console.warn(`GitHub API request failed: user ${userRes.status}, repos ${reposRes.status}`);
        setApiStatus('offline', 'OFFLINE // CACHED');
        loadFallbackOrCached();
        return;
      }

      const user = await userRes.json();
      const repos = await reposRes.json();

      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        user: user,
        repos: repos
      }));

      applyData(user, repos);
      setApiStatus('live', 'LIVE // SYNCED');
    } catch (err) {
      console.warn('Network error fetching GitHub data:', err);
      setApiStatus('offline', 'OFFLINE // CACHED');
      loadFallbackOrCached();
    } finally {
      if (retryBtn) {
        retryBtn.classList.remove('spinning');
        retryBtn.disabled = false;
      }
    }
  }

  function loadFallbackOrCached() {
    const cachedRaw = sessionStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached.repos && cached.repos.length > 0) {
          applyData(cached.user || FALLBACK_USER, cached.repos);
          return;
        }
      } catch (e) {}
    }
    applyData(FALLBACK_USER, FALLBACK_REPOS);
  }

  function applyData(user, repos) {
    // 1. Find Bridge Local
    const bridgeRepo = repos.find(r => r.name.toLowerCase() === 'bridge_local') || FALLBACK_REPOS[0];
    updateBridgeProject(bridgeRepo);

    // 2. Render other repositories
    renderReposList(repos);

    // 3. Re-bind filter buttons if present
    bindRepoFilters();
  }

  function bindRepoFilters() {
    const reposWindow = document.getElementById('projects');
    if (!reposWindow) return;

    const filterBtns = reposWindow.querySelectorAll('.filter-btn');
    const rows = reposWindow.querySelectorAll('.repo-row');

    filterBtns.forEach(btn => {
      // Avoid duplicate event listeners
      btn.onclick = (e) => {
        const filter = btn.getAttribute('data-filter') || 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (window.soundFX) window.soundFX.playClick();

        rows.forEach(row => {
          const lang = (row.getAttribute('data-lang') || '').toLowerCase();
          if (filter === 'all' || lang.includes(filter.toLowerCase())) {
            row.style.display = '';
            row.style.opacity = '0';
            requestAnimationFrame(() => {
              row.style.transition = 'opacity 0.2s ease';
              row.style.opacity = '1';
            });
          } else {
            row.style.display = 'none';
          }
        });
      };
    });
  }

  function init() {
    fetchGithubData(false);

    const retryBtn = document.getElementById('gh-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playClick();
        fetchGithubData(true);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.fetchGithubData = fetchGithubData;
})();
