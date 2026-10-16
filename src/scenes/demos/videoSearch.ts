import { timeline, type Mount } from '../../lib/scene';

interface Config {
  DURATION: number;
  lines: { t: number; s: string }[];
  queries: { q: string; line: number; words: string[]; n: number; ms: number }[];
}

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const TYPE_MS = 38;

export const mount: Mount = (root, { reduced }) => {
  const { DURATION, lines, queries } = JSON.parse(root.dataset.config!) as Config;
  const q = root.querySelector<HTMLElement>('[data-q]')!;
  const meta = root.querySelector<HTMLElement>('[data-meta]')!;
  const head = root.querySelector<HTMLElement>('[data-head]')!;
  const tc = root.querySelector<HTMLElement>('[data-tc]')!;
  const items = [...root.querySelectorAll<HTMLLIElement>('[data-lines] li')];
  const texts = items.map((li) => li.lastElementChild as HTMLElement);
  const tl = timeline();
  let index = 0, playing = false;

  const highlight = (active: number, words: string[] = []) => {
    items.forEach((li, i) => {
      li.classList.toggle('on', i === active);
      // Lines are fixed sample copy, so rebuilding them from the config is safe.
      texts[i].innerHTML = i === active
        ? words.reduce((s, w) => s.replace(new RegExp(`\\b(${w})\\b`, 'i'), '<mark>$1</mark>'), lines[i].s)
        : lines[i].s;
    });
  };
  const land = (i: number) => {
    const query = queries[i], t = lines[query.line].t;
    meta.textContent = `${query.n} matches · ${query.ms} ms`;
    head.style.left = `${(t / DURATION) * 100}%`;
    tc.textContent = mmss(t);
    highlight(query.line, query.words);
  };
  const run = (i: number) => {
    tl.clear();
    index = i % queries.length;
    const query = queries[index];
    if (reduced) { q.textContent = query.q; land(index); return; }
    q.textContent = '';
    meta.textContent = 'searching…';
    highlight(-1);
    [...query.q].forEach((ch, k) => tl.at(TYPE_MS * k, () => { q.textContent += ch; }));
    const typed = TYPE_MS * query.q.length;
    tl.at(typed + 350, () => land(index));
    if (playing) tl.at(typed + 3800, () => run(index + 1));
  };

  root.querySelector('[data-next]')!.addEventListener('click', () => run(index + 1));

  return {
    start() {
      if (reduced || playing) return;
      playing = true;
      tl.at(1800, () => run(index + 1));
    },
    stop() {
      playing = false;
      tl.clear();
      land(index);
      q.textContent = queries[index].q;
    },
  };
};
