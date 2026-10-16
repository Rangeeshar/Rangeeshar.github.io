import { timeline, type Mount } from '../../lib/scene';

interface Mail { from: string; subject: string; rule: string | null }

const STEP_MS = 1900;

export const mount: Mount = (root, { reduced }) => {
  const mail = JSON.parse(root.dataset.mail!) as Mail[];
  const incoming = root.querySelector<HTMLElement>('[data-incoming]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const tl = timeline();
  let playing = false;

  const el = (tag: string, cls: string, text = '') => Object.assign(document.createElement(tag), { className: cls, textContent: text });
  const bucket = (id: string) => root.querySelector<HTMLElement>(`[data-bucket="${id}"]`)!;
  const count = (id: string) => root.querySelector<HTMLElement>(`[data-count="${id}"]`)!;
  const ruleEl = (id: string) => root.querySelector<HTMLElement>(`[data-rule="${id}"]`);

  const reset = () => {
    root.querySelectorAll('[data-bucket]').forEach((b) => b.replaceChildren());
    root.querySelectorAll<HTMLElement>('[data-count]').forEach((c) => (c.textContent = '0'));
    incoming.replaceChildren();
    root.querySelectorAll('.fire').forEach((r) => r.classList.remove('fire'));
  };

  const process = (i: number) => {
    const m = mail[i], target = m.rule ?? 'inbox';
    const card = el('div', 'gm-mail');
    card.append(el('b', '', m.from), el('span', '', m.subject));
    const verdict = el('span', 'gm-verdict', 'evaluating rules…');
    card.append(verdict);
    incoming.replaceChildren(card);

    tl.at(650, () => {
      verdict.textContent = m.rule ? `matched rule · ${m.rule}` : 'no match · stays in Inbox';
      verdict.classList.toggle('hit', !!m.rule);
      if (m.rule) ruleEl(m.rule)?.classList.add('fire');
    });
    tl.at(1350, () => {
      ruleEl(m.rule ?? '')?.classList.remove('fire');
      const li = el('li', 'new');
      li.append(el('b', '', m.from), el('span', '', m.subject));
      bucket(target).prepend(li);
      count(target).textContent = String(bucket(target).children.length);
      incoming.replaceChildren();
      const done = i + 1, actions = mail.slice(0, done).filter((x) => x.rule).length;
      status.textContent = `${done} processed · ${actions} actions`;
    });
    if (!playing) return;
    if (i + 1 < mail.length) tl.at(STEP_MS, () => process(i + 1));
    else tl.at(STEP_MS + 2600, () => { reset(); tl.at(400, () => process(0)); });
  };

  return {
    start() {
      if (reduced || playing) return;
      playing = true;
      tl.at(900, () => { reset(); process(0); });
    },
    stop() {
      playing = false;
      tl.clear();
    },
  };
};
