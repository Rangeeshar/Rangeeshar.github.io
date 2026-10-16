// Moves the visitor's request (the amber dot) down the path rail as the page scrolls,
// and keeps the current hop and the elapsed-latency readout in sync.

export function initRail() {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-rail] a')];
  const sections = links.map((a) => document.getElementById(a.hash.slice(1))!).filter(Boolean);
  const ms = links.map((a) => Number(a.dataset.ms));
  const dot = rail?.querySelector<HTMLElement>('[data-rail-dot]');
  const readout = rail?.querySelector<HTMLElement>('[data-rail-ms]');
  if (!sections.length) return;

  let tops: number[] = [];
  let stops: number[] = [];
  let current = -1;
  const measure = () => {
    tops = sections.map((s) => s.getBoundingClientRect().top + scrollY);
    const base = rail?.getBoundingClientRect().top ?? 0;
    stops = links.map((l) => l.getBoundingClientRect().top - base);
  };

  function update() {
    const y = scrollY + innerHeight * 0.4;
    let i = 0;
    while (i < tops.length - 1 && y >= tops[i + 1]) i++;
    const span = (tops[i + 1] ?? document.documentElement.scrollHeight) - tops[i];
    const frac = Math.min(1, Math.max(0, (y - tops[i]) / span));
    const at = i + frac;

    if (bar) bar.style.transform = `scaleX(${Math.min(1, scrollY / (document.documentElement.scrollHeight - innerHeight))})`;
    if (dot) {
      const a = stops[i], b = stops[i + 1] ?? a;
      dot.style.transform = `translateY(${a + (b - a) * frac}px)`;
    }
    if (readout) {
      const value = i < ms.length - 1 ? ms[i] + (ms[i + 1] - ms[i]) * frac : ms[i];
      readout.textContent = `+${Math.round(value)} ms`;
    }
    const next = Math.floor(at + 0.0001);
    if (next !== current) {
      current = next;
      links.forEach((l, k) => (k === current ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current')));
    }
  }

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  measure();
  update();
  addEventListener('scroll', onScroll, { passive: true });
  const remeasure = () => { measure(); update(); };
  new ResizeObserver(remeasure).observe(document.body);
  document.fonts?.ready.then(remeasure);
}
