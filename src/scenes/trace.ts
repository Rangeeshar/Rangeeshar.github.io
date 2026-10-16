import { onFirstView, replay } from '../lib/scene';

// Enhances the server-rendered trace: span rows become tabs for the detail panel,
// bars grow in when the chart first appears, and the open span tracks today's date.

export function initTrace() {
  const root = document.querySelector<HTMLElement>('[data-trace]');
  if (!root) return;
  const spans = [...root.querySelectorAll<HTMLAnchorElement>('[data-span]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const list = root.querySelector('.trace-rows')!;
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Roles');

  const select = (id: string, focus = false) => {
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
    const now = new Date();
    const t0 = Number(root.dataset.t0), t1 = Number(root.dataset.t1);
    const len = now.getFullYear() * 12 + now.getMonth() - Number(open.dataset.start) + 1;
    if (len > 0 && now.getFullYear() * 12 + now.getMonth() < t1) {
      open.style.setProperty('--w', `${(len / (t1 - t0)) * 100}%`);
      const y = Math.floor(len / 12), m = len % 12;
      open.querySelector('.dur')!.textContent = `${[y && `${y}y`, m && `${m}m`].filter(Boolean).join(' ')}+`;
    }
  }

  select(spans[spans.length - 1].dataset.span!);
  onFirstView(list, () => replay(root));
}
