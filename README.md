# Website Personale — AI_SEC

Personal portfolio website built with **Jekyll** — dark-first, hacker/cybersecurity aesthetic with bio-inspired animated background.

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
- WCAG 2.2 AA accessible
- SEO: OpenGraph, JSON-LD, sitemap, canonical URLs
- Responsive & mobile-first
- GitHub Actions CI/CD with a11y testing
- PR preview deployments

## Build for Production

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## Deployment

Push to `main` triggers automatic build and deploy via GitHub Actions to GitHub Pages.

PRs receive automatic preview deployments.

See [DEVELOPMENT.md](DEVELOPMENT.md) for full docs.
