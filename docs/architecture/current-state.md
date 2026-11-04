# Architecture — current state (after the 2026-11 update)

**Stack:** Jekyll 4.4.1 (Ruby 3.2), SCSS via `sass-embedded`, vanilla JS, GitHub Actions → GitHub Pages (`.github/workflows/ci-preview.yml`). Plugins: `jekyll-sitemap`, `jekyll-feed`. `jekyll-seo-tag` was removed (see design decisions).

## Content model (single sources of truth)

| Data | Feeds |
|---|---|
| `_data/profile.yml` — name, headline, intro, career path, experience, education, languages, skills, contacts | Home hero and path, About (timeline, skills, education), footer, JSON-LD |
| `_data/projects.yml` — `category`, `status`, `visibility` (`public`/`review`), `featured`, `evidence` | Home "Selected work", `/projects/` |
| `_data/certifications.yml` — `category`, `date`, `skills`, `credential_url`, `verification`, `public` | `/certifications/`, About, JSON-LD `hasCredential` |
| `_posts/`, `_writeups/` | `/blog/…`, `/writeups/…` (URLs unchanged) |

To add a project or certificate, add a YAML entry. No template change is needed.

## Templates
`_layouts/default.html` → `_includes/head.html` (theme bootstrap, fonts, CSS, icons) → `_includes/seo.html` (the **only** source of title, description, canonical, OG/Twitter, JSON-LD). Partials: `navbar.html` (data-driven links, `aria-current`), `footer.html`, `profile-photo.html` (WebP/JPEG `srcset`), `project-card.html`.

## Routes
`/`, `/about/` (`#experience`, `#contact`), `/projects/` (`#professional`, `#experiment`, `#learning`), `/certifications/` (new), `/blog/` (+2 posts), `/writeups/` (+4), `/404.html`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`. `/tarological-system/` is served by the separate `tarological-system` repo.

## Styles and scripts
- SCSS partials `_variables` (tokens), `_layout`, `_components`, `_animations`, `_utilities`, **`_portfolio`** (new components, contrast fixes, responsive rules).
- `theme.js`: dark-first toggle, guarded `localStorage`, mobile nav with Escape.
- `graph.js`: canvas graph. Starts on idle; 24 nodes under 768 px; off under reduced motion or Save-Data.
- `projects.js`: category filter with `aria-pressed`. Loaded only on `/projects/` (`scripts: [projects]` front matter).

## Build exclusions / privacy
`_config.yml` excludes `docs`, `scripts`, `assets/images/profile.jpg` (full-res source) and dev files. `.gitignore` excludes `docs/career/` and `docs/chatgpt-continuity/` (private) from version control.

## Tooling
- `scripts/build_images.py`: profile crops (200/400, WebP + JPEG), `og-default.png`, `apple-touch-icon.png`.
- `scripts/check_site.py`: static QA of a build (unique head tags, h1, heading order, alt text, JSON-LD validity and facts, internal links, privacy patterns, sitemap).
