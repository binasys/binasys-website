---
name: binasys-brand
description: Binasys visual identity — logos (wordmark and compact bns mark), favicons, colour palette, fonts, clear space and minimum sizes, with the official logo and favicon files bundled in assets/. Use whenever something needs the Binasys logo, favicon, brand colours or fonts, e.g. "add our logo", "put the favicon on my site", "what's our brand blue", "make this look on-brand", "which logo should I use", or when reviewing whether something follows the brand guide.
---

# Binasys brand (logos, favicons, colours, fonts)

## When to use
- "Add our logo to this page / document / email signature"
- "Add the favicon to my website"
- "What colours / font should I use?" / "Make this look like Binasys"
- "Is this on-brand?" (review)

## Who this is for
Non-technical colleagues. Pick the right file for them, copy it to where it's needed, and explain the choice in one sentence.

## Where the files are
Installed with this skill (copied in by `install.sh` from the shared repo's `brand/` folder):
- `assets/logos/` — logo PNGs
- `assets/favicons/` — favicon PNGs, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, `install-head.html`
- `assets/tokens.css` — colours and fonts as CSS variables
- `assets/brand-guide.pdf` — the full brand guide (18 pages)

Prerequisites check: if `assets/` is missing or empty, the skill was copied without the installer. Tell the user to run `~/binasys-skills/install.sh --update <project>` (or take the files from `brand/` in https://github.com/binasys/binasys-shared-resources).

## Two marks, one identity
| Mark | File (on white / light) | On near-black or blue | Single colour | Use for |
|---|---|---|---|---|
| Primary wordmark "binasys" | `logos/wordmark-colour.png` | `logos/wordmark-white.png` | `logos/wordmark-black.png` | Covers, proposals, documents, website headers, first introductions |
| Compact "bns" | `logos/compact-colour.png` | `logos/compact-white.png` | `logos/compact-black.png` | Favicons, small brand placements, business card, corner of a header |

Never use `logo-preview.png` or `*-approved-crop.png` in work — they are reference/source files.
Rule of thumb: the full name introduces Binasys; the compact mark is for where space is limited.

## Logo rules
- **Clear space:** at least 0.25 × the logo's visible height (H) on every side.
- **Minimum size:** wordmark 140 px wide on screen / 35 mm in print. Compact mark 48 px for readable letters; 16–32 px only as a favicon.
- **Backgrounds:** white is the default. Colour logo on white or soft surface; white logo on near-black `#1D1D1F` or blue `#0066CC`. No busy photos behind it.
- **Never:** retype the logo in a font, stretch/squash (keep proportions — always set only width *or* height), rotate, recolour, add effects, or redraw the blue connection.
- Files are raster PNGs. For large-format print or vector needs, tell the user this needs separate preparation by the brand owner.

## Colours
| Name | Hex | Use |
|---|---|---|
| Binasys blue | `#0066CC` | Logo accents, links, selected information — emphasis, not decoration |
| Near-black | `#1D1D1F` | Headings and body |
| White | `#FFFFFF` | Primary canvas |
| Soft surface | `#F5F5F7` | Quiet support areas |
| Supporting text | `#626268` | Secondary information |
| Rules | `#E2E2E7` | Dividers and grids |

White space leads. Near-black carries the message. Blue provides emphasis. Don't add other colours; for charts, use greys plus one blue highlight.

## Fonts
- Presentations & documents: Helvetica Neue; fallback Arial.
- Websites: system sans-serif (`system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`). No web-font downloads.

## Workflows

### Add the logo to a web page
1. Copy the right logo into the site's `assets/` folder (e.g. `assets/logo.png` from `logos/wordmark-colour.png`).
2. `<img src="assets/logo.png" alt="Binasys" height="40">` — set height only, so proportions stay. 40 px height ≈ 133 px wide; use ≥ 44 px height to meet the 140 px wordmark minimum, or use the compact mark if space is tight.

### Add favicons to a website
1. Copy all files from `assets/favicons/` (except `install-head.html`) into the site's root (next to `index.html`).
2. Paste the tags from `assets/favicons/install-head.html` into `<head>`.
3. If the site is published in a sub-folder (GitHub Pages project site, e.g. `user.github.io/my-site/`), remove the leading `/` from each `href` so they're relative.
4. Preview and check the browser tab. Note browsers cache favicons — a hard refresh may be needed.

### Add the logo to a document / email signature
Use `wordmark-colour.png` (or `compact-colour.png` for signatures/small spaces). Insert as a picture, keep the aspect ratio locked, respect clear space.

### Review for brand compliance
Check: correct mark for the space, proportions, minimum size, clear space, background contrast, colours only from the palette, one blue emphasis, fonts. Report findings as a short list with the fix for each.

## Confirm before
Overwriting existing logo/favicon files in the user's project.

## Tell the user
Which file you used and why (one line), where you copied it, and how to preview it.

## Troubleshooting
| Problem | What to do |
|---|---|
| Logo looks blurry | It's shown larger than its file size (wordmark 1028 px, compact 886 px wide). Keep it smaller, or ask the brand owner for a larger export |
| Favicon doesn't show | Check files are next to `index.html`, paths match, and fix leading `/` for sub-folder sites; hard refresh |
| Logo has a white box on a dark background | Use the `-white` variant |
| User wants a new colour or logo variation | Not allowed without the brand owner — explain and offer the closest approved option |
