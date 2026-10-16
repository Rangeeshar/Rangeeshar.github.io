// Shared lifecycle for every animated scene: load the module when it nears the viewport,
// run it only while it is visible, and render a still final frame for reduced-motion users.

export interface Scene {
  start(): void;
  stop(): void;
}

export type Mount = (root: HTMLElement, opts: { reduced: boolean }) => Scene;

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Mounts a lazily imported scene on every element matching `selector`. */
export function activate(selector: string, load: () => Promise<{ mount: Mount }>) {
  document.querySelectorAll<HTMLElement>(selector).forEach((root) => {
    const near = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        const scene = (await load()).mount(root, { reduced: reducedMotion() });
        runWhileVisible(root, scene);
      },
      { rootMargin: '400px 0px' },
    );
    near.observe(root);
  });
}

function runWhileVisible(root: HTMLElement, scene: Scene) {
  let visible = false;
  const sync = () => (visible && !document.hidden ? scene.start() : scene.stop());
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: 0.15 }).observe(root);
  document.addEventListener('visibilitychange', sync);
}

/** Calls `fn` once, the first time `el` is mostly on screen. */
export function onFirstView(el: Element, fn: () => void, threshold = 0.35) {
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    fn();
  }, { threshold });
  io.observe(el);
}

/** Restarts the CSS animations scoped under `.play` on `el`. */
export function replay(el: Element) {
  el.classList.remove('play');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('play');
}

/** Reads the current theme's color tokens and re-reads them whenever the theme changes. */
export function themeColors<K extends string>(names: readonly K[], onChange: () => void) {
  const colors = {} as Record<K, string>;
  const read = () => {
    const style = getComputedStyle(document.documentElement);
    for (const n of names) colors[n] = style.getPropertyValue(`--${n}`).trim();
  };
  read();
  const update = () => { read(); onChange(); };
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', update);
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return colors;
}

/** A cancellable sequence of timeouts, for demos that loop through steps. */
export function timeline() {
  let ids: number[] = [];
  return {
    at(ms: number, fn: () => void) { ids.push(window.setTimeout(fn, ms)); },
    clear() { ids.forEach(clearTimeout); ids = []; },
  };
}
