import type { Mount } from '../../lib/scene';

// A small pipeline simulation: clips arrive, queue at each stage, and move on when a stage finishes.

interface Stage { id: string; ms: number }
interface Slot { clip: string | null; elapsed: number; queue: string[] }

const ARRIVAL_MS = 1150;
const clipName = (n: number) => `clip_${String(n).padStart(3, '0')}`;

export const mount: Mount = (root, { reduced }) => {
  const stages = JSON.parse(root.dataset.stages!) as Stage[];
  const rows = stages.map((s) => root.querySelector<HTMLElement>(`[data-stage="${s.id}"]`)!);
  const parts = rows.map((r) => ({
    clip: r.querySelector<HTMLElement>('[data-clip]')!,
    fill: r.querySelector<HTMLElement>('[data-fill]')!,
    queue: r.querySelector<HTMLElement>('[data-queue]')!,
  }));
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const doneEl = root.querySelector<HTMLElement>('[data-done]')!;

  // Continue from the resting state rendered on the server.
  let next = 43, exported = 38, sinceArrival = 0, last = 0, running = false;
  const slots: Slot[] = stages.map((s, i) => ({ clip: clipName(42 - i), elapsed: s.ms * 0.5, queue: [] }));

  const write = (line: string, secs: number) => {
    const li = document.createElement('li');
    li.textContent = line;
    const t = document.createElement('span');
    t.textContent = `${secs.toFixed(1)} s`;
    li.append(t);
    log.prepend(li);
    while (log.children.length > 3) log.lastElementChild!.remove();
  };

  function step(dt: number) {
    sinceArrival += dt;
    if (sinceArrival >= ARRIVAL_MS) { sinceArrival = 0; slots[0].queue.push(clipName(next++)); }
    for (let i = stages.length - 1; i >= 0; i--) {
      const slot = slots[i];
      if (slot.clip) {
        slot.elapsed += dt;
        if (slot.elapsed >= stages[i].ms) {
          write(`${slot.clip} · ${stages[i].id} · done`, stages[i].ms / 1000);
          if (i + 1 < stages.length) slots[i + 1].queue.push(slot.clip);
          else doneEl.textContent = `exported · ${++exported} clips`;
          rows[i].classList.add('flash');
          window.setTimeout(() => rows[i].classList.remove('flash'), 220);
          slot.clip = null;
        }
      }
      if (!slot.clip && slot.queue.length) { slot.clip = slot.queue.shift()!; slot.elapsed = 0; }
    }
  }

  function render() {
    slots.forEach((slot, i) => {
      parts[i].clip.textContent = slot.clip ?? '';
      parts[i].fill.style.transform = `scaleX(${slot.clip ? Math.min(1, slot.elapsed / stages[i].ms) : 0})`;
      parts[i].queue.textContent = `queue ${slot.queue.length}`;
      rows[i].classList.toggle('busy', !!slot.clip);
    });
  }

  function tick(t: number) {
    if (!running) return;
    step(Math.min(50, t - (last || t)));
    last = t;
    render();
    requestAnimationFrame(tick);
  }

  return {
    start() {
      if (reduced || running) return;
      running = true; last = 0;
      requestAnimationFrame(tick);
    },
    stop() { running = false; },
  };
};
