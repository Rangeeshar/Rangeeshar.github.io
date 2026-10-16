import { reducedMotion } from './scene';

// Page-wide motion primitives:
//  - scrub(): drives a section's `--p` (0 → 1) from scroll. Pinned sections (taller than the
//    viewport, with a sticky stage) progress while the stage is held; others progress as they
//    pass into view. One rAF-throttled loop serves every scene.
//  - initReveals(): adds `.in` to [data-reveal] / [data-boot] elements and split headings as they appear.
//  - decode(): settles text out of scrambled glyphs, left to right.

type Kind = 'auto' | 'exit';
interface Scrub { el: HTMLElement; cb?: (p: number) => void; kind: Kind; prop: string; active: boolean; last: number }
const scrubs: Scrub[] = [];
let queued = false;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

function progress(el: HTMLElement, kind: Kind) {
  const r = el.getBoundingClientRect(), vh = innerHeight;
  if (kind === 'exit') return clamp(-r.top / r.height);
  if (r.height > vh * 1.2) return clamp(-r.top / (r.height - vh));
  return clamp((vh * 0.9 - r.top) / (r.height * 0.75));
}

function apply(s: Scrub) {
  const p = progress(s.el, s.kind);
  if (Math.abs(p - s.last) < 0.0005) return;
  s.last = p;
  s.el.style.setProperty(s.prop, p.toFixed(4));
  s.cb?.(p);
}
function frame() {
  queued = false;
  for (const s of scrubs) if (s.active) apply(s);
}
const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };

/** `exit` measures how far a section has scrolled out of the top instead of into view. */
export function scrub(el: HTMLElement, cb?: (p: number) => void, { kind = 'auto', prop = '--p' }: { kind?: Kind; prop?: string } = {}) {
  if (reducedMotion()) {
    el.style.setProperty(prop, kind === 'exit' ? '0' : '1');
    cb?.(kind === 'exit' ? 0 : 1);
    return;
  }
  const s: Scrub = { el, cb, kind, prop, active: false, last: -1 };
  scrubs.push(s);
  // A scene leaving the viewport gets one last update, so a fast jump never leaves it half-played.
  new IntersectionObserver(([e]) => { s.active = e.isIntersecting; apply(s); }, { rootMargin: '200px 0px' }).observe(el);
  if (scrubs.length === 1) {
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
  }
  schedule();
}

export function initReveals() {
  if (reducedMotion()) return;
  document.documentElement.classList.add('reveal-ready');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], [data-boot], .split').forEach((el) => io.observe(el));
}

const GLYPHS = '0123456789ABCDEF#%+/<>';
export function decode(el: HTMLElement, duration = 900) {
  const final = el.textContent ?? '';
  if (reducedMotion() || !final.trim()) return;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const settled = Math.floor(t * final.length);
    el.textContent = [...final].map((ch, i) =>
      i < settled || ch === ' ' || /[·→.,–-]/.test(ch) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0],
    ).join('');
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}
