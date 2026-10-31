---
name: binasys-site
description: Use when editing, adding or restyling pages, copy, navigation, header/footer, CSS, colours, logos, favicons, JavaScript, images or deployment of the Binasys website (business consulting for Malaysian SMEs; Eleventy static site in src/ built to dist/). Covers src/*.html pages, src/_includes/*.njk, src/_data/site.json, src/assets/css/site.css, src/assets/js/ and src/assets/brand/.
---

# Binasys website: how to work on it

A plain static HTML/CSS/JS site. Eleventy runs **only at build time** to wrap each page in a shared
layout. Visitors get static files from `dist/`. Never add a runtime framework, server code, bundler
or client-side router.

## Related skills (they take priority over this one)

- **`binasys-brand`**: which logo to use, logo rules, colours, fonts, brand compliance review.
- **`binasys-company-context`**: company facts (`reference/company.md`), terms
  (`reference/glossary.md`) and house style (`reference/style-guide.md`). Use it for all page copy.

If this skill and those disagree, follow them and tell the user about the conflict.

## Golden rules

1. **Edit `src/`, never `dist/`.** `dist/` is generated and git-ignored.
2. **One page = one file** in `src/<name>.html`, containing front matter + the `<main>` content only.
   No `<html>`, `<head>`, header, footer or contact dialog in page files; those come from
   `src/_includes/layouts/base.njk` and its partials.
3. **Relative, root-level paths.** Pages are at the site root: `href="services.html"`,
   `src="assets/brand/logos/wordmark-colour.png"`. No leading `/` and no pretty URLs
   (`/services/`). JS that builds URLs to assets uses the same `assets/...` form.
4. **CSS order is the cascade.** `src/assets/css/site.css` is the three former stylesheets in their
   original load order: `style.css`, then `pages.css`, then `navigation.css`. Later sections
   override earlier ones. Add new rules to the end of the most specific relevant section. Do not
   reorder sections or "dedupe" rules without a visual check.
5. **Brand palette only** (see "Colours and fonts"). Never add a colour that is not in the palette.
6. **Official logos only** from `src/assets/brand/`. Never retype, redraw, recolour, stretch or
   rotate the logo.
7. **Images:** illustrations, icons and the hero paper-stack animation are inline SVG / CSS in the
   markup; keep them that way. Any new raster image is WebP, diagrams are SVG, with descriptive
   names and no versions, dates or pixel sizes, in `src/assets/images/`.
8. **No git commands** unless the user explicitly asks.
9. **Stay inside this repo.** Everything needed is in the project folder. Don't read or search
   outside it; if something is missing (e.g. a new logo or icon), ask the user.

## Brand files (`src/assets/brand/`)

The official brand files (brand guide of 27 October 2026) and the only copy in this repo. Treat them
as read-only: do not edit, rename, resize or re-export them. Only the brand owner (Jack) changes
brand files; replace them with new official files of the same name. If a file you need is not
here, ask the user for it.

| Path                        | What                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `logos/wordmark-colour.png` | Primary wordmark "binasys". Header and footer on white / soft surface                                     |
| `logos/wordmark-white.png`  | Wordmark on near-black `#1D1D1F` or blue `#0066CC`                                                        |
| `logos/wordmark-black.png`  | Single-colour use only                                                                                    |
| `logos/compact-*.png`       | Compact "bns" mark (colour / white / black) for tight spaces                                              |
| `favicons/`                 | `favicon.ico`, `favicon-circle-*.png`, `favicon-square-*.png`, `apple-touch-icon.png`, `site.webmanifest` |
| `tokens.css`                | Brand CSS variables (`--bns-*`)                                                                           |

The old `binasys-rounded-*` logo and favicon have been removed. Do not reintroduce them.

### Logo rules

- Header and footer use `src/_includes/partials/logo.njk`: `wordmark-colour.png` at 44 px high
  (≈ 146 px wide), switching via `<picture>` to `compact-colour.png` at 48 px on screens ≤ 370 px.
  Use `wordmark-white.png` / `compact-white.png` on near-black or blue.
- Set **height only** (`.brand-wordmark{height:…;width:auto}`) so proportions stay. Wordmark
  minimum 140 px wide on screen (height ≥ 44 px); if there is no room, use the compact mark at ≥ 48 px.
- Clear space of at least 0.25 × the logo height on every side. No busy backgrounds behind it.
- Linked logo: `<a class="wordmark" href="index.html" aria-label="Binasys home">` with the image
  `alt=""`; unlinked logo: `alt="Binasys"`.
- Files are raster PNG (wordmark 1028 px, compact 886 px wide). Don't display them larger than that.

### Favicons

In `src/_includes/layouts/base.njk` `<head>`, with relative paths (the site runs in a sub-folder):

```html
<link rel="icon" href="assets/brand/favicons/favicon.ico" sizes="any" />
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="assets/brand/favicons/favicon-circle-32.png"
/>
<link rel="apple-touch-icon" href="assets/brand/favicons/apple-touch-icon.png" />
<link rel="manifest" href="assets/brand/favicons/site.webmanifest" />
<meta name="theme-color" content="#0066CC" />
```

Icon paths inside `site.webmanifest` are relative to the manifest, so keep it next to its icons.

## Colours and fonts

`assets/brand/tokens.css` loads before `assets/css/site.css` (both linked in `base.njk`). The first
`:root` block in `site.css` maps the site's own variables to the brand tokens; new CSS uses these
variables, never literal hex values:

| Site variable | Brand token             | Hex       | Use                                          |
| ------------- | ----------------------- | --------- | -------------------------------------------- |
| `--paper`     | `--bns-white`           | `#FFFFFF` | Primary canvas (default background)          |
| `--surface`   | `--bns-soft-surface`    | `#F5F5F7` | Quiet support areas (cards, contact panel)   |
| `--ink`       | `--bns-near-black`      | `#1D1D1F` | Headings and body                            |
| `--muted`     | `--bns-supporting-text` | `#626268` | Secondary information                        |
| `--line`      | `--bns-rules`           | `#E2E2E7` | Dividers and grids                           |
| `--blue`      | `--bns-blue`            | `#0066CC` | Links, buttons, one highlight: emphasis only |

- White space leads, near-black carries the message, blue provides emphasis. No other colours;
  charts use greys plus one blue highlight. Transparency of palette colours is fine for shadows and
  overlays.
- `site.css` contains no literal colours. Translucent colours are written as
  `color-mix(in srgb,var(--ink) 14%,transparent)`; use the same pattern for shadows and overlays.
  Hover states use transform/shadow rather than a different shade of blue.
- Font: `font-family: var(--bns-font-web)` (system sans-serif). No web-font downloads.
- Text must meet WCAG AA contrast (white on `#0066CC` and `#626268` on white both pass).

## Copy and content

Follow `binasys-company-context` (`reference/style-guide.md`). In short:

- British English, short sentences, active voice, plain words. Lead with the point.
- Headings in sentence case. Numbered items use two digits: 01, 02, 03.
- Name is always "Binasys" (never "BINASYS", "BinaSys"). Tagline exactly "Building Tomorrow, Starting Today."
- No buzzwords (leverage, synergy, cutting-edge, revolutionary). Talk about the client's business;
  say "We use AI to <specific task>", not "AI-powered".
- Services map to the three workstreams: 01 Strategy, 02 Analytics, 03 Implementation.
- Dates as "27 October 2026"; currency as "RM 1,200".
- **Never invent facts**, numbers, names or testimonials. **Never publish client names** (e.g. Urban
  Pickle), prices or internal metrics unless the user confirms. Contact details stay "coming soon"
  until the user provides them; ask rather than guess.

## Page front matter

```yaml
---
title: "How We Help — Binasys"
description: "…"
pageId: "services" # body[data-page]: home | services | industries | about | contact | privacy | privasi | terms | not-found
serviceDialog: true # services page only: adds partials/service-dialog.njk and its <noscript> style
---
```

`--header-height` is set in CSS (76 px, 68 px on mobile), not in front matter.
Defaults (`layout`, `permalink: {{ page.filePathStem }}.html`) live in `src/src.11tydata.json`.
Page bodies are rendered with Nunjucks, so a literal `{{` or `{%` in content must be wrapped in
`{% raw %}…{% endraw %}`.

## Pages

| File                                                                        | Nav label                                        |
| --------------------------------------------------------------------------- | ------------------------------------------------ |
| `src/index.html`                                                            | Home                                             |
| `src/services.html`                                                         | How We Help                                      |
| `src/industries.html`                                                       | Your Business                                    |
| `src/about.html`                                                            | About Us                                         |
| `src/contact.html`                                                          | (header CTA)                                     |
| `src/privacy.html`, `src/privasi.html` (BM, `lang: "ms"`), `src/terms.html` | Footer legal links (`layout: layouts/legal.njk`) |
| `src/404.html`                                                              | none (`useBase: true`, `noindex: true`)          |

## Common tasks

| Task                                    | Where                                                                                                                                                                                                                                               |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change page copy                        | Headings/intros: `src/<page>.html`. Repeating content is in YAML (apply the copy rules above): `team.yaml`, `steps.yaml` (about), `services.yaml` (services cards + dialog + home summary cards), `industries.yaml` (industry tabs) in `src/_data/` |
| Multi-line YAML text                    | Lists of lines rendered with `lines()` from `src/_includes/macros.njk` (joins with `<br />`, escapes text)                                                                                                                                          |
| Industry icons, service illustrations   | `src/_includes/icons/<name>.njk` (named by `icon:` in `industries.yaml`); `src/_includes/service-art/<id>.njk`                                                                                                                                      |
| Legal pages                             | `src/privacy.html` + `src/privasi.html` (keep in step), `src/terms.html`; links in `legalNav` in `site.json`                                                                                                                                        |
| Add a page                              | New `src/<name>.html`; add to `mainNav` (header + mobile menu) and `footerNav` in `src/_data/site.json`                                                                                                                                             |
| Footer, header                          | `src/_includes/partials/footer.njk`, `header.njk`                                                                                                                                                                                                   |
| Name, tagline, address, contact details | `src/_data/business.yaml` (use `{{ business.name }}` etc.; never hardcode). Facts come from `binasys-company-context`                                                                                                                               |
| Nav                                     | `src/_data/site.json`                                                                                                                                                                                                                               |
| `<head>`, favicons, global CSS/JS       | `src/_includes/layouts/base.njk`                                                                                                                                                                                                                    |
| Wordmark markup                         | `src/_includes/partials/logo.njk`                                                                                                                                                                                                                   |
| "Let's talk"                            | Links to `contact.html` (Formspree enquiry form; endpoint in `business.yaml`)                                                                                                                                                                       |
| Service detail dialog (services page)   | `src/_includes/partials/service-dialog.njk`; `services.yaml` is written into `#service-data` JSON (filter `serviceData` in `eleventy.config.js`) and read by `app.js`. Never hardcode service text in JS                                            |
| Colours                                 | Variable mapping at the top of `src/assets/css/site.css`; brand values in `src/assets/brand/tokens.css` (read-only)                                                                                                                                 |
| Logos, favicons                         | `src/assets/brand/` (read-only, official files)                                                                                                                                                                                                     |

## Scripts (`src/assets/js/`)

- `navigation.js`: loaded in `<head>`; cross-page transition/reveal (`pagereveal`); respects
  `prefers-reduced-motion`.
- `app.js`: loaded at end of `<body>`; mobile menu (`.menu-toggle` / `#mobile-menu`), scrolled
  header, enquiry form, service dialog, industry tabs and example details, hero paper-stack
  animation with its pause/play toggle, scroll reveals; respects `prefers-reduced-motion`.

## Verify every change

```sh
npm run format   # Prettier (skips *.njk, images, src/assets/brand/ and .opencode/skills/)
npm run lint     # Prettier check + Stylelint + build + HTMLHint on dist/
npm start        # http://localhost:8080. Check affected pages at desktop and ~390px mobile
```

Before finishing, check that:

- The browser console has no errors and the network tab has no 404s (including favicons).
- When renaming or moving an asset, a search of `src/` finds no remaining references to the old
  path.
- The homepage hero animation runs, its pause button works, and reduced motion is respected.
- Every "Let's talk" button goes to `contact.html`; the service dialog opens, switches services and closes with × and Escape.
- Industry tabs work with mouse and keyboard; the mobile menu opens and closes.
- **Brand review** (per `binasys-brand`) on anything visual you changed: right mark for the space,
  proportions, minimum size, clear space, background contrast, palette-only colours, one blue
  emphasis, system font. Report issues as a short list with the fix for each.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys `dist/` to GitHub Pages on every
push to `main`. Pull requests into `main` only build and lint. Only a build failure blocks deployment;
lint is reported but non-blocking, so still run `npm run lint` locally. Keep all paths relative: the
site is served from `/binasys-website/` until the custom domain `www.binasys.com.my` (registered;
primary, bare domain redirects to it) is pointed at GitHub Pages. When switching, also set `basePath` in `site.json` to `/`. Do not add `src/CNAME` until the
user confirms the DNS is set up (see README, "Deploying").
