# Request Path: portfolio design direction

Status: draft 1, awaiting decisions (see the end of this file).

## Concept

The portfolio is told as one request travelling through the systems Rangeesh builds.
The visitor is the request, every section is a hop, and the page ends with `200 OK`.

Motion rule: every animation depicts a real system behavior (a packet routes, a span
grows, a cache hits). If an animation can't be named this way, cut it.

## Scenes (in scroll order)

| Hop | Section | Scene | Motion |
| --- | --- | --- | --- |
| `edge` | Hero | Live system topology on canvas; name in condensed display type; fact readouts (10K–100K+ rps, 99.95%, 850 → 490 ms, 7+ yrs) | Ambient cobalt traffic; the visitor's amber packet enters and the readout prints per-hop latency. The cursor bends nearby packets; a click sends a request |
| `gateway` | About | Summary as three short "routes"; small photo ID badge | Route lines light as the packet passes |
| `services` | Experience | Career as a distributed-trace waterfall; selecting a role opens its "span attributes" (real metrics) | Spans grow in sequence; metrics count up once |
| `workloads` | Projects | One pinned scene per project with a micro-demo instead of screenshots | Video search jumps to the matched moment; Gmail rules sort mail; cart recalculates the discount; bill splits; journal facets filter; media pipeline stages |
| `stack` | Skills | Skills grouped by architecture layer (client, api, ai, data, infra); choosing a project lights the tools it used | Opacity and color only |
| `response` | Contact | TCP handshake (SYN, SYN-ACK, ACK), then ESTABLISHED with contact links; the footer prints `200 OK · 47 ms` | Three packets, then fade-in |

## Visual system

Colors (light / dark):

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--bg` | page | `#EEF0F4` | `#0B0F14` |
| `--surface` | panels | `#E3E7EE` | `#121821` |
| `--line` | rules, wires | `#C9CFDA` | `#242D3A` |
| `--ink` | text | `#101722` | `#E2E7EE` |
| `--muted` | secondary text | `#586274` | `#8893A4` |
| `--accent` | ambient traffic | `#2443E0` | `#7E95FF` |
| `--hot` | the visitor | `#B86200` | `#FFB547` |
| `--ok` | 2xx / success only | `#11804F` | `#3DD68C` |

Type: Bricolage Grotesque (display, condensed `wdth` 76–88), Instrument Sans (body),
JetBrains Mono (data, labels, readouts).

Motion tokens: `--dur-micro` 120ms, `--dur-ui` 240ms, `--dur-scene` 700ms,
`--ease-out` `cubic-bezier(.16,1,.3,1)`, `--ease-io` `cubic-bezier(.65,0,.35,1)`.

Rules:
1. One lead moment per screen; everything else is still or near-still.
2. Animate only `transform` and `opacity`; canvas loops pause off-screen.
3. Content is complete at rest; motion only reveals it.
4. `prefers-reduced-motion` shows each scene's final frame, with the same information.

## Architecture

- **Astro**, static output, deployed to GitHub Pages by one Actions workflow.
- **GSAP + ScrollTrigger** as the only motion dependency (pinned and scrubbed scenes).
- **Canvas 2D** for the topology; no Three.js.
- **Content as data**: one Markdown file per project, roles, metrics and skills in a typed `profile.ts`.
- **Scenes as modules** exporting `mount()` / `destroy()`, loaded near the viewport.
- **Budget**: JS < 90 KB gzipped, LCP < 1.2 s on 4G, CLS 0, Lighthouse 95+.
- **Accessibility**: canvas is `aria-hidden`; all content is semantic HTML; keyboard paths and visible focus.

```
src/
  content/projects/*.md
  content/profile.ts
  scenes/topology.ts  trace.ts  handshake.ts  demos/*
  components/*.astro
  styles/tokens.css
  pages/index.astro
.github/workflows/deploy.yml
```

## Phases

1. **Foundation**: Astro, tokens, type, content files, every section as static HTML, Pages deploy.
2. **Hero + trace**: topology canvas with cursor routing; trace waterfall with span attributes.
3. **Project demos**: pinned project scenes, micro-demos, stack map, handshake.
4. **Polish**: reduced-motion frames, perf pass against the budget, OG image, SEO, analytics.

## Open decisions

1. Current status for the hero: open to roles, freelancing, or a new position? (The latest listed role ends Dec 2025.)
2. The summary says 7+ years, but listed roles start Feb 2021. Add the 2018–2021 roles?
3. Which three or four project micro-demos ship first?
4. Keep the photo as a small badge in About, or go fully type-led?
