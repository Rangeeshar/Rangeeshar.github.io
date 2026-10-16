# Rangeesh Rajagopal · Portfolio

Personal site of Rangeesh Rajagopal, Lead Software Engineer at HighLevel. Live at [rangeeshar.github.io](https://rangeeshar.github.io).

The site is told as one request travelling through the kind of systems I build: the visitor is the request, each section is a hop, and the page ends with `200 OK`. The design direction is in [docs/DESIGN.md](docs/DESIGN.md).

## Sections

Every section is a scene. Scroll drives the story.

| Hop | Section | What you see |
| --- | --- | --- |
| `edge` | Intro | The name rises letter by letter, the system map draws itself in, then live traffic flows. Click to send your own request; the cursor bends nearby packets. The headline lifts away as you scroll. |
| `gateway` | About | Pinned. A request enters the gateway and fans out to three routes; each route's text lights up word by word as it is served. |
| `services` | Experience | Pinned. Scrolling moves a time cursor from 2018 to today: roles grow under it, the clock ticks, and the detail panel follows the role in flight. |
| `workloads` | Work | Each demo boots like a screen powering on, then runs a live version of the project, pinned beside its copy. |
| `stack` | Skills | The stack assembles bottom-up, then a request beam traces each project through exactly the tools it used. |
| `response` | Contact | A TCP handshake, then the email address resolves out of noise. |

On phones the pinned scenes play as they scroll into view. With reduced motion, every scene shows its final frame.

## Stack

- [Astro](https://astro.build), static output, about 10 KB of JavaScript in total
- Canvas 2D, SVG and CSS for motion, with no animation library: one scroll loop drives a `--p` progress variable per scene (`src/lib/motion.ts`)
- Self-hosted variable fonts: Bricolage Grotesque, Instrument Sans, JetBrains Mono

## Editing content

All copy lives in [`src/data/profile.ts`](src/data/profile.ts): roles, projects, skills, education and the hero facts. The sections render from it, so adding a role or project means adding one entry.

```
src/
  data/profile.ts       content
  components/           one Astro component per section, demos/ for project demos
  scenes/               animation logic, lazy-loaded near the viewport
  lib/scene.ts          shared scene lifecycle (load, run while visible, reduced motion)
  styles/global.css     design tokens, light and dark
```

## Development

Requires Node 22.12 or newer.

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run check    # type-check
npm run build    # static build into dist/
```

## Deployment

Pushing to `master` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which type-checks, builds and deploys `dist/` to GitHub Pages. In the repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**.

## Contact

- Email: <rangees28@gmail.com>
- LinkedIn: [linkedin.com/in/arrangeesh](https://www.linkedin.com/in/arrangeesh)
- GitHub: [github.com/Rangeeshar](https://github.com/Rangeeshar)

## License

See [license.txt](license.txt).
