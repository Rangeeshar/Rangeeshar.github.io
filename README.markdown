# Rangeesh Rajagopal · Portfolio

Personal site of Rangeesh Rajagopal, Lead Software Engineer at HighLevel. Live at [rangeeshar.github.io](https://rangeeshar.github.io).

The site is told as one request travelling through the kind of systems I build: the visitor is the request, each section is a hop, and the page ends with `200 OK`. The design direction is in [docs/DESIGN.md](docs/DESIGN.md).

## Sections

| Hop | Section | What moves |
| --- | --- | --- |
| `edge` | Intro | Live system topology: ambient traffic, your own request on click, cursor-bent packets |
| `gateway` | About | Three "routes" that light up in sequence |
| `services` | Experience | Career as a distributed-trace waterfall with span attributes |
| `workloads` | Work | A live micro-demo per project: video search, media pipeline, Gmail rules, bill splitting |
| `stack` | Skills | Skills by architecture layer; choosing a piece of work lights the tools it used |
| `response` | Contact | A TCP handshake, then the connection is established |

Every scene pauses off-screen, and visitors who prefer reduced motion get each scene's final frame.

## Stack

- [Astro](https://astro.build), static output, about 10 KB of JavaScript in total
- Canvas 2D and plain CSS for motion, with no animation library
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

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which type-checks, builds and deploys `dist/` to GitHub Pages. In the repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**.

## Contact

- Email: <rangees28@gmail.com>
- LinkedIn: [linkedin.com/in/arrangeesh](https://www.linkedin.com/in/arrangeesh)
- GitHub: [github.com/Rangeeshar](https://github.com/Rangeeshar)

## License

See [license.txt](license.txt).
