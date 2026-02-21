# Development Guide

## Prerequisites
- Ruby 3.x + Bundler
- Node 18+ and npm (for image-opt and pa11y)

## Quick Start (Development)

```powershell
bundle install
npm install
bundle exec jekyll serve --livereload --drafts
```

Or use the npm script:
```powershell
npm run dev
```

This will:
- Start Jekyll dev server at `http://localhost:4000`
- Enable LiveReload (auto-refresh on file changes)
- Show draft posts
- Auto-compile SCSS on save

## Build for Production

```powershell
npm run build:win   # Windows
npm run build       # Linux/macOS
```

## Image Optimization

```powershell
npm run image-opt
```

Generates `.webp` and optimized JPEGs from images in `assets/images/`.

## Accessibility Testing

```powershell
npm run lint:a11y
```

Runs pa11y-ci against the built site (requires `_site/` to exist).

## Stack
- **SSG:** Jekyll 4.4
- **Styling:** SCSS (compiled by Jekyll's built-in Sass)
- **JS:** Vanilla ES5 (theme.js, graph.js, projects.js)
- **CI/CD:** GitHub Actions (build + a11y + deploy)
- **Design:** Dark-first, hacker/cyber aesthetic

## File Structure

```
_config.yml          # Jekyll config
_layouts/            # HTML layouts (default, post)
_includes/           # Partials (head, navbar, footer)
_data/projects.yml   # Projects data file
assets/css/          # SCSS design system
assets/js/           # JavaScript modules
assets/images/       # Images
about/               # About page
blog/                # Blog index
projects/            # Projects page
_posts/              # Blog posts (Markdown)
```

## Branching
- `main` — production
- `dev` — development
- `feature/*` — feature branches

Commit convention: Conventional Commits.
