import { onFirstView, reducedMotion } from '../lib/scene';
import { scrub } from '../lib/motion';

// Enhances the server-rendered trace:
//  - span rows become tabs for the detail panel (click or arrow keys),
//  - scrolling the pinned scene moves a time cursor from the first role to today: bars grow
//    under it, the clock ticks, and the panel follows the role in flight at the cursor,
//  - where the scene isn't pinned (phones), the cursor sweeps once when the chart appears.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PINNED = '(min-width: 900px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)';

export function initTrace() {
  const section = document.querySelector<HTMLElement>('[data-services]');
  const root = document.querySelector<HTMLElement>('[data-trace]');
  if (!section || !root) return;
  const spans = [...root.querySelectorAll<HTMLAnchorElement>('[data-span]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const list = root.querySelector('.trace-rows')!;
  const clock = section.querySelector<HTMLElement>('[data-clock]')!;
  const inflight = section.querySelector<HTMLElement>('[data-inflight]')!;
  const t0 = Number(root.dataset.t0), t1 = Number(root.dataset.t1);
  const now = new Date(), nowM = now.getFullYear() * 12 + now.getMonth();
  const tNow = ((nowM - t0) / (t1 - t0)) * 100;
  const roles = spans.map((s) => ({ id: s.dataset.span!, start: Number(s.dataset.start), end: s.dataset.end ? Number(s.dataset.end) : Infinity }));

  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Roles');
  let selected = '';
  const select = (id: string, focus = false) => {
    if (id === selected) return;
    selected = id;
    spans.forEach((s) => {
      const on = s.dataset.span === id;
      s.setAttribute('aria-selected', String(on));
      s.tabIndex = on ? 0 : -1;
      if (on && focus) s.focus();
    });
    panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
  };
  spans.forEach((s, i) => {
    s.setAttribute('role', 'tab');
    s.setAttribute('aria-controls', `role-${s.dataset.span}`);
    s.addEventListener('click', (e) => { e.preventDefault(); select(s.dataset.span!); });
    s.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      select(spans[(i + step + spans.length) % spans.length].dataset.span!, true);
    });
  });
  panels.forEach((p) => p.setAttribute('role', 'tabpanel'));

  // The open span was sized at build time; stretch it to today.
  const open = root.querySelector<HTMLAnchorElement>('.span.open');
  if (open) {
    const len = nowM - Number(open.dataset.start) + 1;
    if (len > 0 && nowM < t1) {
      open.style.setProperty('--w', String((len / (t1 - t0)) * 100));
      const y = Math.floor(len / 12), m = len % 12;
      open.querySelector('.dur')!.textContent = `${[y && `${y}y`, m && `${m}m`].filter(Boolean).join(' ')}+`;
    }
  }

  // Cursor position (0..tNow, in axis percent) → clock, in-flight count and followed role.
  let lastRole = '';
  const setTime = (t: number) => {
    root.style.setProperty('--t', t.toFixed(3));
    const month = Math.round(t0 + (t / 100) * (t1 - t0));
    clock.textContent = `${MONTHS[((month % 12) + 12) % 12]} ${Math.floor(month / 12)}`;
    const live = roles.filter((r) => r.start <= month && month <= r.end);
    inflight.textContent = `${live.length} span${live.length === 1 ? '' : 's'} in flight`;
    const follow = live.at(-1) ?? [...roles].reverse().find((r) => r.start <= month);
    if (follow && follow.id !== lastRole) { lastRole = follow.id; select(follow.id); }
    root.classList.toggle('settled', t >= tNow - 0.01);
  };

  select(spans[spans.length - 1].dataset.span!);
  if (reducedMotion()) { setTime(tNow); return; }

  if (matchMedia(PINNED).matches) {
    // Hold the last 12% of the scene on "today" so the current role can be read.
    scrub(section, (p) => setTime(Math.min(1, p / 0.88) * tNow));
  } else {
    setTime(0);
    onFirstView(list, () => {
      root.classList.add('tween');
      root.style.setProperty('--t', tNow.toFixed(3));
      // Step the clock and panel alongside the CSS sweep.
      const start = performance.now(), D = 2600;
      const step = (ts: number) => {
        const k = Math.min(1, (ts - start) / D);
        const eased = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        const t = eased * tNow;
        const month = Math.round(t0 + (t / 100) * (t1 - t0));
        clock.textContent = `${MONTHS[((month % 12) + 12) % 12]} ${Math.floor(month / 12)}`;
        if (k < 1) requestAnimationFrame(step);
        else { root.classList.remove('tween'); setTime(tNow); }
      };
      requestAnimationFrame(step);
    }, 0.3);
  }
}
