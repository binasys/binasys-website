# Binasys brand kit

The single, current source of Binasys brand files. Always take logos and favicons from here (or from the installed `binasys-brand` skill) — never from old emails, screenshots or re-drawn copies.

Full rules: [brand-guide.pdf](brand-guide.pdf) (27 October 2026).

## Which file do I use?

| I need… | Use | Notes |
|---|---|---|
| Logo on a cover, proposal, document, website header (white background) | `logos/wordmark-colour.png` | Primary mark. Min 140 px wide on screen / 35 mm in print |
| Logo on a dark or blue background | `logos/wordmark-white.png` | |
| Single-colour (black) print, fax, stamp | `logos/wordmark-black.png` | |
| Small logo (app header corner, social avatar, business card) | `logos/compact-colour.png` | Compact "bns" mark. Min 48 px |
| Small logo on dark / blue | `logos/compact-white.png` | |
| Small logo, single colour | `logos/compact-black.png` | |
| Website browser-tab icon | everything in `favicons/` + `favicons/install-head.html` | See below |
| Preview / reference only | `logos/logo-preview.png`, `logos/*-approved-crop.png` | Approved source crops — don't place these in documents |

## Rules in one minute
- **White is the default background.** Use the colour logo on white or soft surface (#F5F5F7); white logo on near-black or Binasys blue.
- **Clear space:** at least 0.25 × the logo's height on every side.
- **Don't** retype the logo in a font, stretch, rotate, recolour, add shadows, or put it on busy photos.
- **Favicons:** the compact mark only. At 16–32 px it is a favicon only, not a logo.
- Artwork is raster (PNG). Large-format print or a vector master needs separate preparation — ask the brand owner.

## Colours

| Name | Hex | Use |
|---|---|---|
| Binasys blue | `#0066CC` | Logo accents, links, one highlight per slide/chart |
| Near-black | `#1D1D1F` | Headings and body |
| White | `#FFFFFF` | Primary canvas |
| Soft surface | `#F5F5F7` | Quiet support areas |
| Supporting text | `#626268` | Secondary information |
| Rules | `#E2E2E7` | Dividers and grids |

CSS variables: [`tokens.css`](tokens.css).

## Typography
Helvetica Neue for presentations and documents, Arial as the fallback. Websites use the system sans-serif. Sizes for slides: Title 45 pt · Heading 30 pt · Body 18 pt · Caption 12 pt.

## Adding favicons to a website
1. Copy all files from `favicons/` into the website's root folder (next to `index.html`).
2. Paste the contents of `favicons/install-head.html` inside `<head>`.

For sites that live in a sub-folder (e.g. GitHub Pages project sites), remove the leading `/` from the paths in those tags.

## Changing the brand kit
Only the brand owner updates these files. Replace files with the same names, bump `VERSION`, and note it in `CHANGELOG.md`. Installed projects get the new files with `./install.sh --update <project>`.
