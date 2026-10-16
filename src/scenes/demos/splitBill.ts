import { timeline, type Mount } from '../../lib/scene';

const MIN = 2;
const AUTO = [4, 5, 6, 3, 4];

const inr = (paise: number) =>
  `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

/** Splits in whole paise; the first few people absorb the remainder so shares always sum to the total. */
export function split(totalPaise: number, people: number) {
  const base = Math.floor(totalPaise / people), extra = totalPaise - base * people;
  return Array.from({ length: people }, (_, i) => base + (i < extra ? 1 : 0));
}

export const mount: Mount = (root, { reduced }) => {
  const total = Number(root.dataset.total) * 100;
  const names = JSON.parse(root.dataset.names!) as string[];
  const bars = [...root.querySelectorAll<HTMLElement>('[data-bar] i')];
  const shares = root.querySelector<HTMLElement>('[data-shares]')!;
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const note = root.querySelector<HTMLElement>('[data-note]')!;
  const tl = timeline();
  let people = 4, auto = 0, touched = false, playing = false;

  const render = (n: number) => {
    people = Math.min(names.length, Math.max(MIN, n));
    const parts = split(total, people);
    count.textContent = `${people} people`;
    bars.forEach((b, i) => (b.style.flexGrow = i < people ? '1' : '0'));
    shares.replaceChildren(...parts.map((p, i) => {
      const li = document.createElement('li');
      const who = document.createElement('span'), amt = document.createElement('b');
      who.textContent = names[i];
      amt.textContent = inr(p);
      li.append(who, amt);
      return li;
    }));
    const uneven = parts[0] !== parts[parts.length - 1];
    note.textContent = `${uneven ? 'Rounded to the paisa, so shares sum exactly' : 'Even split'} · computed in your browser · nothing stored`;
  };

  const loop = () => {
    if (!playing || touched) return;
    render(AUTO[auto++ % AUTO.length]);
    tl.at(2200, loop);
  };

  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
    b.addEventListener('click', () => {
      touched = true;
      tl.clear();
      render(people + Number(b.dataset.step));
    }),
  );

  return {
    start() {
      if (reduced || playing) return;
      playing = true;
      tl.at(1600, loop);
    },
    stop() {
      playing = false;
      tl.clear();
    },
  };
};
