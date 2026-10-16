import { themeColors, type Mount } from '../lib/scene';

// The hero: a system topology with ambient traffic (cobalt) and the visitor's own request (amber).
// Nodes sit on a unit grid; edges route orthogonally like a schematic.

type Pt = [number, number];
const NODES: Record<string, [x: number, y: number, label: string]> = {
  you: [0.04, 0.52, 'you'],
  edge: [0.17, 0.52, 'edge'],
  gw: [0.32, 0.52, 'gateway'],
  api: [0.5, 0.18, 'fastapi'],
  ai: [0.5, 0.52, 'llm workers'],
  jobs: [0.5, 0.86, 'queue'],
  cache: [0.71, 0.3, 'redis'],
  db: [0.71, 0.74, 'postgres'],
  s3: [0.93, 0.52, 'aws s3'],
};
const AMBIENT = [
  ['edge', 'gw', 'api', 'cache'], ['edge', 'gw', 'api', 'db'], ['edge', 'gw', 'ai', 'cache'],
  ['edge', 'gw', 'ai', 'db'], ['edge', 'gw', 'jobs', 'db', 's3'], ['edge', 'gw', 'jobs', 's3'], ['edge', 'gw', 'api', 'cache', 's3'],
];
const MINE = ['you', 'edge', 'gw', 'api', 'cache', 'api', 'gw', 'edge', 'you'];
const HOP_MS: Record<string, number> = { edge: 3, gw: 2, api: 31, cache: 1 };
const EDGES = [...new Set([...AMBIENT, MINE].flatMap((r) => r.slice(1).map((b, i) => [r[i], b].sort().join('|'))))];

interface Packet {
  route: string[]; pts: Pt[]; marks: [number, string][]; total: number;
  d: number; v: number; next: number; hot: boolean;
  log?: string[]; seen?: Set<string>; ms?: number;
}

export const mount: Mount = (root, { reduced }) => {
  const canvas = root.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const out = root.querySelector<HTMLElement>('[data-readout]')!;
  const C = themeColors(['line', 'muted', 'surface', 'accent', 'hot'] as const, () => draw());

  let W = 0, H = 0, narrow = false, active = false, running = false, last = 0, spawnAcc = 0;
  // Intro: the graph draws itself left to right before traffic starts.
  let intro = reduced ? 1 : 0;
  const INTRO_S = 1.6;
  const reveal = (id: string) => Math.min(1, Math.max(0, (intro * 1.5 - NODES[id][0]) * 3));
  let packets: Packet[] = [];
  const heat: Record<string, number> = {};
  const pointer = { x: -1e4, y: -1e4 };

  const pos = (id: string): Pt => {
    const [x, y] = NODES[id];
    // Phones get the same graph turned on its side, top to bottom.
    return narrow ? [(0.16 + y * 0.68) * W, (0.12 + x * 0.84) * H] : [x * W, y * H];
  };
  const seg = (a: string, b: string): Pt[] => {
    const [ax, ay] = pos(a), [bx, by] = pos(b);
    if (narrow) { const my = (ay + by) / 2; return [[ax, ay], [ax, my], [bx, my], [bx, by]]; }
    const mx = (ax + bx) / 2;
    return [[ax, ay], [mx, ay], [mx, by], [bx, by]];
  };
  const path = (route: string[]) => {
    const pts: Pt[] = [], marks: [number, string][] = [];
    let total = 0;
    route.slice(1).forEach((b, i) => {
      for (const p of seg(route[i], b).slice(i ? 1 : 0)) {
        const q = pts[pts.length - 1];
        if (q) total += Math.hypot(p[0] - q[0], p[1] - q[1]);
        pts.push(p);
      }
      marks.push([total, b]);
    });
    return { pts, marks, total };
  };
  const at = (p: Packet, d: number): Pt => {
    let acc = 0;
    for (let i = 1; i < p.pts.length; i++) {
      const a = p.pts[i - 1], b = p.pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (acc + l >= d) { const t = l ? (d - acc) / l : 0; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
      acc += l;
    }
    return p.pts[p.pts.length - 1];
  };
  const spawn = (route: string[], hot: boolean): Packet =>
    ({ route, ...path(route), d: 0, v: hot ? 260 : 150 + Math.random() * 140, next: 0, hot });

  // The cursor acts like a load balancer: nearby ambient packets bend toward it.
  const bend = ([x, y]: Pt): Pt => {
    const dx = pointer.x - x, dy = pointer.y - y, dist = Math.hypot(dx, dy), R = 110;
    if (dist > R) return [x, y];
    const k = 0.35 * (1 - dist / R);
    return [x + dx * k, y + dy * k];
  };

  function resize() {
    const r = root.getBoundingClientRect();
    narrow = r.width < 600;
    W = r.width; H = narrow ? 540 : 380;
    canvas.style.height = `${H}px`;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    packets = packets.map((p) => ({ ...p, ...path(p.route) }));
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1; ctx.strokeStyle = C.line;
    for (const e of EDGES) {
      const [a, b] = e.split('|');
      const pts = seg(a, b);
      const len = pts.slice(1).reduce((n, q, i) => n + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
      ctx.setLineDash([len * Math.min(reveal(a), reveal(b) * 0.5 + 0.5), len + 1]);
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const p of packets) {
      const head = p.hot ? at(p, p.d) : bend(at(p, p.d));
      const tail = p.hot ? at(p, Math.max(0, p.d - 34)) : bend(at(p, Math.max(0, p.d - 18)));
      const color = p.hot ? C.hot : C.accent;
      ctx.strokeStyle = color; ctx.globalAlpha = 0.45; ctx.lineWidth = p.hot ? 3 : 2;
      ctx.beginPath(); ctx.moveTo(...tail); ctx.lineTo(...head); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(head[0], head[1], p.hot ? 4.5 : 2.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.lineWidth = 1;
    ctx.font = '500 11px "JetBrains Mono Variable", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const id in NODES) {
      const shown = reveal(id);
      if (!shown) continue;
      ctx.globalAlpha = shown;
      const [x, y] = pos(id), h = heat[id] ?? 0, s = (id === 'you' ? 7 : 9) * (0.6 + 0.4 * shown);
      const lit = h > 1 ? C.hot : C.accent;
      ctx.fillStyle = C.surface; ctx.strokeStyle = h > 0.05 ? lit : C.muted;
      ctx.fillRect(x - s, y - s, s * 2, s * 2);
      ctx.strokeRect(x - s + 0.5, y - s + 0.5, s * 2 - 1, s * 2 - 1);
      if (h > 0.05) {
        ctx.globalAlpha = Math.min(h, 1) * 0.9; ctx.fillStyle = lit;
        ctx.fillRect(x - 3, y - 3, 6, 6); ctx.globalAlpha = shown;
      }
      const label = NODES[id][2];
      const w = ctx.measureText(label).width + 8;
      ctx.fillStyle = C.surface;
      ctx.fillRect(x - w / 2, y + 15, w, 14);
      ctx.fillStyle = id === 'you' ? C.hot : C.muted;
      ctx.fillText(label, x, y + 22);
    }
    ctx.globalAlpha = 1;
  }

  function report(p: Packet, id: string) {
    if (id === 'you') {
      out.innerHTML = `you → ${p.log!.join(' → ')} → <span class="ok">200 OK</span> · <b>${p.ms} ms</b>`;
      return;
    }
    if (p.seen!.has(id)) return;
    p.seen!.add(id);
    const ms = HOP_MS[id] ?? 0;
    p.ms! += ms;
    p.log!.push(`${NODES[id][2]} <b>${ms} ms</b>`);
    out.innerHTML = `you → ${p.log!.join(' → ')} …`;
  }

  function send() {
    const p = Object.assign(spawn(MINE, true), { log: [], seen: new Set<string>(), ms: 0 });
    out.textContent = 'you → …';
    if (reduced) { MINE.forEach((id) => report(p, id)); return; }
    packets.push(p);
    if (active && !running) { running = true; last = 0; requestAnimationFrame(tick); }
  }

  function tick(t: number) {
    if (!running) return;
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    if (intro < 1) intro = Math.min(1, intro + dt / INTRO_S);
    spawnAcc += dt;
    if (intro > 0.7 && spawnAcc > 0.11 && packets.length < 140) {
      spawnAcc = 0;
      packets.push(spawn(AMBIENT[(Math.random() * AMBIENT.length) | 0], false));
    }
    for (const id in heat) heat[id] *= 0.93;
    packets = packets.filter((p) => {
      p.d += p.v * dt;
      while (p.next < p.marks.length && p.marks[p.next][0] <= p.d) {
        const id = p.marks[p.next][1];
        heat[id] = p.hot ? 1.6 : Math.max(heat[id] ?? 0, 0.9);
        if (p.hot) report(p, id);
        p.next++;
      }
      return p.d < p.total;
    });
    draw();
    requestAnimationFrame(tick);
  }

  new ResizeObserver(resize).observe(root);
  canvas.addEventListener('pointerdown', send);
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  });
  canvas.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1e4; });
  root.querySelector('[data-send]')!.addEventListener('click', send);

  let auto = 0;
  if (reduced) {
    // Still frame: a few packets mid-flight and a completed request in the readout.
    packets = AMBIENT.map((r, i) => { const p = spawn(r, false); p.d = p.total * (0.25 + (i % 4) * 0.18); return p; });
    resize();
    send();
  } else {
    window.setTimeout(send, 1900); // after the intro; if queued early, it flies once the scene starts
  }

  return {
    start() {
      if (reduced || active) return;
      active = running = true; last = 0;
      requestAnimationFrame(tick);
      auto = window.setInterval(send, 6500);
    },
    stop() {
      active = running = false;
      clearInterval(auto);
    },
  };
};
