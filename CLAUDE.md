# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML website for **Nails by Thuy** — a private freehand nail art studio in Austin TX 78725. No build step, no framework, no package manager. All pages are self-contained HTML files deployed directly to Netlify.

Live site: `https://www.nailsbythuy.com`

## Local Development

Preview the site with any static server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

To test the Netlify serverless function locally:
```bash
npm install -g netlify-cli
netlify dev
```
The `generate-article` function requires `GEMINI_API_KEY` set in Netlify environment variables (never in code).

## Deployment

Push to the `main` branch — Netlify auto-deploys with no build command. The publish directory is `.` (repo root). Netlify handles HTML pretty URLs, CSS/JS minification, and image compression automatically.

## Architecture

### Page Types
- **`index.html`** — homepage (single-page with anchor sections: `#gallery`, `#booking`, `#reviews`, `#faq-section`, `#about`, `#nail-tips`)
- **`services.html`** — dedicated services menu page
- **`blog.html`** — blog hub displaying 12 static nail care articles with direct links to article pages
- **Blog articles** — one static `.html` file per article slug (e.g. `biab-vs-gel-x.html`)
- **`404.html`** — custom error page

### URL Routing
All clean-URL routing is in **`_redirects`** (not `netlify.toml` — the two must not duplicate each other). The pattern is: canonical slug → `.html` file via **200 rewrite** (keeps the clean URL in the address bar, matching the canonical tag). Section shortcuts on the homepage use 302. Unknown routes fall through to `404.html` with a real 404 status.

### Netlify Function
**`netlify/functions/generate-article.js`** — a serverless Gemini API proxy that calls `gemini-2.5-flash` and returns a JSON article object. The AI generator UI was removed from `blog.html`; the function remains deployed but has no frontend caller. New articles are created as static HTML files and added to `SEED_ARTICLES` in `blog.html`. The API key (`GEMINI_API_KEY`) lives in Netlify environment variables and never touches the browser.

### Images
Images live in two directories:
- **`/images/`** — WebP at two sizes: `-400.webp` (mobile) and `-900.webp` (desktop)
- **`/nailsbythuy-showcase-seo/`** — AVIF and WebP originals used in the SEO gallery snippet

All image markup uses `<picture>` with AVIF source first, then WebP srcset with responsive `sizes`. Images get 1-year immutable cache headers.

## Design System

CSS variables (design tokens) live in one place: **`shared.css`** at the repo root. Every page links to it — do not redefine `:root {}` inline in any page's `<style>` block.

| Variable   | Value     | Usage                  |
|------------|-----------|------------------------|
| `--ink`    | `#18120f` | Primary text/background dark |
| `--paper`  | `#f8f5f0` | Page background        |
| `--bone`   | `#ede8e0` | Subtle backgrounds     |
| `--dust`   | `#c8bfb4` | Tertiary accent        |
| `--terra`  | `#b5624f` | Accent / brand color   |
| `--sand`   | `#c9a97a` | Secondary accent       |
| `--mist`   | `#8a7f76` | Muted text             |
| `--gap`    | `2px`     | Grid gap between tiles |

To change a design token: edit `shared.css` only — all pages pick it up automatically.

**Fonts:** Cormorant Garamond (display/headings, 300 weight) + DM Sans (body, 300–400 weight). Both loaded from Google Fonts non-blocking via `onload` swap trick, with `<noscript>` fallback.

**Typography classes:** `.t-label` (small caps label), `.t-display` (hero display text), `.t-heading` (section headings), `.t-body` (body copy).

## Tooling Scripts

All scripts live in `scripts/` and require only Node.js or Python (no npm install needed).

### Add a new blog article (3 steps, down from 6 manual)

```bash
node scripts/new-article.js
```

This interactive generator handles steps 1–5 automatically (creates HTML, patches `_redirects`, `sitemap.xml`, and `blog.html`). You then write the article content and optionally add an `Article` entry to `index.html` JSON-LD.

After adding content, validate redirects:
```bash
node scripts/validate-redirects.js
```

### Update the nav on all article pages

Edit `_fragments/nav-article.html`, then run:
```bash
node scripts/stamp.js
```

This updates `<!-- NAV:START --> ... <!-- NAV:END -->` blocks in all 12 article pages. Blog, services, and index nav are managed separately (each has unique links).

### Resize new gallery images

```bash
python3 scripts/resize-images.py <source-image.jpg> <slug>
# Example: python3 scripts/resize-images.py ~/Downloads/new-set.jpg chrome-nails-austin-03
```

Creates `images/<slug>-400.webp` and `images/<slug>-900.webp`.

## SEO Conventions

Every page must include:
1. `<title>` under 60 chars with location signal ("Austin TX")
2. `<meta name="description">` 140–160 chars
3. `<link rel="canonical">` pointing to the clean slug URL (no `.html`)
4. Open Graph + Twitter card tags
5. JSON-LD structured data in `<script type="application/ld+json">` — homepage uses `NailSalon`/`LocalBusiness` schema; articles use `Article` + `FAQPage` + `BreadcrumbList`; blog hub uses `Blog` + `ItemList`

When adding a new blog article — use the generator (`node scripts/new-article.js`) which handles steps 1–5 automatically. Step 6 is still manual:
6. Add an `Article` entry to `index.html` JSON-LD `@graph` (copy the pattern from an existing entry). All 12 current articles are already in `@graph`.

**Known maintainability notes:**
- Design tokens are in `shared.css` — never inline `:root {}` in a page's `<style>` block.
- Review data has one source of truth: live Google Places API + `FALLBACK_REVIEWS` JS array in `index.html`. The JSON-LD `aggregateRating` stays; individual review entries were removed.
- The `generate-article.js` Netlify function is deployed but has no frontend caller — it is intentionally dormant.
- Z-index stack: cursor `100001`, lightbox close `100000`, lightbox `99999`, FAB `9998`, desktop modal `9998`, nav `200`, hamburger `210`, drawer `190`.

## Business Context

- **Owner:** Thuy (also known as "Twee"), Master Nail Technician, 15+ years experience
- **Phone/booking:** Text `(425) 905-0469` — `sms:+14259050469` in links
- **Address:** Varrelman St, Austin TX 78725 (East Austin — exact street address is private)
- **Google Place ID:** `ChIJpWwrrsS5RIYRKrruowqxcgk`
- **Services:** Freehand nail art, acrylic full sets, Gel X extensions, BIAB/builder gel, dipping powder, pedicures
- By appointment only; payment via cash, credit card, or Zelle
