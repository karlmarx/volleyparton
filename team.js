// Edit these two after each game; both pages read from here.
const RECORD = { w: 1, l: 2, t: 0 };
const NEXT_GAME = '2026-10-31T11:30:00-04:00'; // Sat Oct 31, 11:30 AM EDT

const GAME_LENGTH_MS = 2 * 60 * 60 * 1000;
const pad = n => String(n).padStart(2, '0');

function countdownText(now) {
  const ms = Date.parse(NEXT_GAME) - now;
  if (ms <= -GAME_LENGTH_MS) return 'Results coming soon…';
  if (ms <= 0) return '🎾 Game on! Happening now';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor(s / 3600) % 24, m = Math.floor(s / 60) % 60;
  return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s % 60)}s`;
}

function tick() {
  const text = countdownText(Date.now());
  document.querySelectorAll('[data-countdown]').forEach(el => { el.textContent = text; });
}

document.querySelectorAll('[data-record]').forEach(el => {
  el.textContent = `${RECORD.w}-${RECORD.l}-${RECORD.t}`;
});
document.querySelectorAll('[data-w]').forEach(el => { el.textContent = RECORD.w; });
document.querySelectorAll('[data-l]').forEach(el => { el.textContent = RECORD.l; });
document.querySelectorAll('[data-t]').forEach(el => { el.textContent = RECORD.t; });
tick();
setInterval(tick, 1000);
