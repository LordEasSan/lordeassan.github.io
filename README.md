# Website Personale — Alessandro Bragetti (AI_SEC)

Personal portfolio of an SAP BTP & Full Stack Developer, built with **Jekyll**. Dark-first, with a graph-inspired animated background; AI engineering and cybersecurity are kept as research and learning tracks.

Professional facts live in `_data/profile.yml`, projects in `_data/projects.yml`, certifications in `_data/certifications.yml`. Architecture notes: `docs/architecture/current-state.md`.

## Quick Start

```bash
bundle install
npm install
bundle exec jekyll serve --livereload --drafts
```

Dev server runs at `http://localhost:4000` with auto-refresh.

## Stack

| Layer | Technology |
|-------|------------|
| SSG | Jekyll 4.4 |
| Styling | SCSS (Jekyll built-in Sass) |
| JS | Vanilla (theme, canvas graph, project filters) |
| CI/CD | GitHub Actions → GitHub Pages |
| Design | Dark-first, Meta AI + Hacker aesthetic |
| Background | Canvas-based neural graph animation |

## Features

- Dark-first design with light mode toggle
- Bio-inspired animated canvas background
- Glassmorphism navbar
- Project filtering by tags
- Accessibility: targets WCAG 2.2 AA; automated checks only (Lighthouse, W3C Nu validator, `scripts/check_site.py`), no conformance claim
- SEO: one `_includes/seo.html` (title, canonical, OpenGraph, JSON-LD Person/ProfilePage), sitemap, feed
- Responsive & mobile-first
- GitHub Actions build + deploy to Pages (no automated tests in CI yet)
- Local QA: `python -I scripts/check_site.py _site`

## Build for Production

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## Deployment

Push to `main` triggers automatic build and deploy via GitHub Actions to GitHub Pages.

PRs receive automatic preview deployments.

See [DEVELOPMENT.md](DEVELOPMENT.md) for full docs.
