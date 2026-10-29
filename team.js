// Season data, from the league page:
// https://pridesportsusa.com/register/rp_fpjif5
// After each game, fill in `us` and `them` (games won) and add a title.
const SEASON = { division: 'Division B', rank: 11, teams: 16, pointsFor: 168, pointsAgainst: 139 };
const GAMES = [
  { at: '2026-10-03T11:30:00-04:00', opp: 'Team 1', court: 2, us: 5, them: 6, title: 'So Close, Yet So Coiffed' },
  { at: '2026-10-17T11:30:00-04:00', opp: 'Dink Around & Find Out', court: 9, us: 0, them: 8, title: 'We Dinked Around. We Found Out.' },
  { at: '2026-10-24T11:30:00-04:00', opp: 'Dinky and the Brains', court: 4, us: 7, them: 3, title: 'Here We Come Again' },
  { at: '2026-10-31T11:30:00-04:00', opp: 'Ball Smackers', court: 8 },
  { at: '2026-11-07T11:30:00-05:00', opp: 'Paulmann', court: 3 },
  { at: '2026-11-14T11:30:00-05:00', opp: 'TBD', title: 'Playoffs, Round 1' },
  { at: '2026-11-21T11:30:00-05:00', opp: 'TBD', title: 'Playoffs: The Finale' },
];

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
