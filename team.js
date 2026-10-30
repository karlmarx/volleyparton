// Season data (SEASON, GAMES) comes from season.js, which loads first.

const GAME_LENGTH_MS = 2 * 60 * 60 * 1000;
const pad = n => String(n).padStart(2, '0');
const played = g => g.us != null;
const fmtDate = g => new Date(g.at).toLocaleString('en-US', {
  timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});

const RECORD = GAMES.filter(played).reduce((r, g) => {
  r[g.us > g.them ? 'w' : g.us < g.them ? 'l' : 't']++;
  return r;
}, { w: 0, l: 0, t: 0 });

// The next game is the first unplayed one that hasn't finished yet.
function nextGame(now) {
  return GAMES.find(g => !played(g) && Date.parse(g.at) + GAME_LENGTH_MS > now);
}

function countdownText(now) {
  const g = nextGame(now);
  if (!g) return 'See you next season!';
  const ms = Date.parse(g.at) - now;
  if (ms <= 0) return '🎾 Game on! Happening now';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor(s / 3600) % 24, m = Math.floor(s / 60) % 60;
  return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s % 60)}s`;
}

function nextLabel(now) {
  const g = nextGame(now);
  if (!g) return 'Season wrapped';
  return `${fmtDate(g)} · vs ${g.opp}${g.court ? ` · Court ${g.court}` : ''}`;
}

function tick() {
  const now = Date.now();
  document.querySelectorAll('[data-countdown]').forEach(el => { el.textContent = countdownText(now); });
  document.querySelectorAll('[data-next]').forEach(el => { el.textContent = nextLabel(now); });
}

function renderEpisodes(el) {
  el.innerHTML = '';
  GAMES.forEach((g, i) => {
    const li = document.createElement('li');
    const result = played(g) ? (g.us > g.them ? 'W' : g.us < g.them ? 'L' : 'T') : '';
    li.className = result ? `r-${result.toLowerCase()}` : 'upcoming';
    li.innerHTML = `<span class="ep">EP ${i + 1}</span><span class="info"><b></b><small></small></span>`
      + `<span class="score">${result ? `${result} ${g.us}–${g.them}` : 'TBA'}</span>`;
    li.querySelector('b').textContent = g.title || `vs ${g.opp}`;
    li.querySelector('small').textContent = `${fmtDate(g)}${g.title ? ` · vs ${g.opp}` : ''}${g.court ? ` · Court ${g.court}` : ''}`;
    el.appendChild(li);
  });
}

document.querySelectorAll('[data-record]').forEach(el => { el.textContent = `${RECORD.w}-${RECORD.l}-${RECORD.t}`; });
['w', 'l', 't'].forEach(k => document.querySelectorAll(`[data-${k}]`).forEach(el => { el.textContent = RECORD[k]; }));
document.querySelectorAll('[data-rank]').forEach(el => { el.textContent = `#${SEASON.rank} of ${SEASON.teams}`; });
document.querySelectorAll('[data-points]').forEach(el => { el.textContent = `${SEASON.pointsFor}–${SEASON.pointsAgainst}`; });
document.querySelectorAll('[data-episodes]').forEach(renderEpisodes);
tick();
setInterval(tick, 1000);
