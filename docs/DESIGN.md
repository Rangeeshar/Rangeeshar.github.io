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
| `edge` | Hero | Live system topology on canvas; name in condensed display type; fact readouts (10K–100K+ rps, 99.95%, 850 → 490 ms, 8+ yrs); title: Lead Software Engineer @ HighLevel | Ambient cobalt traffic; the visitor's amber packet enters and the readout prints per-hop latency. The cursor bends nearby packets; a click sends a request |
| `gateway` | About | Summary as three short "routes"; small photo ID badge | Route lines light as the packet passes |
| `services` | Experience | Career as a distributed-trace waterfall, 2018 to now; overlapping roles render as parallel spans and the current role as an open span; selecting a role opens its "span attributes" (real metrics) | Spans grow in sequence; metrics count up once |
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

## Architecture (as built)

- **Astro 7**, static output, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
- **No animation library.** The plan called for GSAP + ScrollTrigger, but every scene turned out to need only
  Canvas 2D, CSS keyframes, `position: sticky` and IntersectionObserver. Dropping GSAP keeps total JS near 10 KB.
- **Content as data**: everything lives in `src/data/profile.ts`; sections render from it.
- **Scenes** share one lifecycle (`src/lib/scene.ts`): lazy-loaded near the viewport, started while visible,
  stopped off-screen or in a background tab, final frame only under reduced motion.
- **Server-rendered first**: the trace, demos and stack map render complete in HTML; scripts only animate and add interaction.
- **Accessibility**: canvas is `aria-hidden`; the trace is a keyboard-operable tablist; visible focus; skip link.

```
src/
  data/profile.ts
  components/*.astro, components/demos/*.astro
  scenes/topology.ts  rail.ts  trace.ts  demos/*
  lib/scene.ts  lib/text.ts
  styles/global.css
  pages/index.astro
.github/workflows/deploy.yml
```

## Status

All four phases are built: foundation, hero and trace, project demos, and polish (reduced motion, OG image,
JSON-LD, theme toggle). Featured demos: Semantic Video Search, the Jupitrr media pipeline, Gmail Actions and SplitBiller.
Discount Store and Nurexus are listed without demos. The photo appears as a small badge in About.

Still open:
1. Scope and impact bullets for the HighLevel role (currently title and dates only).
