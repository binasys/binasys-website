---
name: binasys-brand
description: Binasys visual identity for this website — logos (wordmark and compact bns mark), favicons, colour palette, fonts, clear space, minimum sizes, charts, tables and graphics. The official files live in src/assets/brand/. Use whenever something needs the Binasys logo, favicon, brand colours or fonts, e.g. "add our logo", "what's our brand blue", "make this look on-brand", "which logo should I use", or when reviewing whether something follows the brand guide.
---

# Binasys brand (logos, favicons, colours, fonts)

Summary of the Binasys brand guide (27 October 2026). This skill is the complete brand reference for
this project; there is no other copy of the guide in the repo.

## Scope: stay inside this repo

- All brand files are in `src/assets/brand/`. Use only these.
- Do **not** read, search or look for brand files outside this project folder (home directory,
  other repos, shared kits, installers, websites).
- If a logo, icon, size, format (e.g. SVG, larger PNG) or variant is needed that is not listed
  below, **stop and ask the user to provide it**. Never create, redraw, trace or re-export one.

## Files (`src/assets/brand/`, read-only)

| File                        | Use                                                                         |
| --------------------------- | --------------------------------------------------------------------------- |
| `logos/wordmark-colour.png` | Primary wordmark "binasys" on white or soft surface (1028 × 310 px)         |
| `logos/wordmark-white.png`  | Wordmark on near-black `#1D1D1F` or blue `#0066CC`                          |
| `logos/wordmark-black.png`  | Wordmark, single-colour use                                                 |
| `logos/compact-colour.png`  | Compact "bns" mark on white or soft surface (886 × 437 px)                  |
| `logos/compact-white.png`   | Compact mark on near-black or blue                                          |
| `logos/compact-black.png`   | Compact mark, single-colour use                                             |
| `favicons/`                 | `favicon.ico`, `favicon-circle-{16…512}.png`, `favicon-square-{16…512}.png`, `apple-touch-icon.png`, `site.webmanifest` |
| `tokens.css`                | Brand CSS variables (`--bns-*`)                                             |

Do not edit, rename, resize or re-export these. Only the brand owner changes them; new versions
replace files of the same name.

## Two marks, one identity

The full name introduces Binasys. The compact mark carries recognition.

- **Primary wordmark "binasys"**: rounded lowercase lettering with a blue a/s connection. Use for
  first introductions: website header and footer, covers, documents.
- **Compact "bns"**: rounded bns interlock; blue follows the n arch and right downstroke, with a
  black shared stem and white interlock cuts. Use for favicons and small placements where space is
  limited.

## Logo rules

- **Clear space:** at least 0.25 × H on every side (H = visible height of the mark).
- **Minimum size:** wordmark 140 px wide on screen (≈ 44 px high) / 35 mm in print. Compact mark
  48 px for readable letters; 16–32 px only as a favicon (at 16 px it reads mainly as a silhouette;
  check it in context).
- **Backgrounds:** white is the default. Colour logo on white or soft surface `#F5F5F7`; white logo
  on near-black `#1D1D1F` or blue `#0066CC`; black logo for single-colour use. No busy photos.
- **Never:** retype the logo in a font (the lettering is artwork, not a font), stretch or squash
  (set width _or_ height only), rotate, recolour, add shadows/effects, redraw the blue connection or
  alter the interlock cuts.
- Files are raster PNG. Don't display them larger than their pixel size. Large-format print or a
  vector master needs separate preparation: ask the user.

## Colours

White space leads. Near-black carries the message. Blue provides emphasis.

| Name            | Hex       | Token                   | Use                                          |
| --------------- | --------- | ----------------------- | -------------------------------------------- |
| Binasys blue    | `#0066CC` | `--bns-blue`            | Logo accents, links, selected information    |
| Near-black      | `#1D1D1F` | `--bns-near-black`      | Headings and body                            |
| White           | `#FFFFFF` | `--bns-white`           | Primary canvas                               |
| Soft surface    | `#F5F5F7` | `--bns-soft-surface`    | Quiet support areas                          |
| Supporting text | `#626268` | `--bns-supporting-text` | Secondary information                        |
| Rules           | `#E2E2E7` | `--bns-rules`           | Dividers and grids                           |

No other colours. Blue is emphasis, not decoration: one blue highlight per section, chart or table.

## Fonts

- Website: system sans-serif, `var(--bns-font-web)`. No web-font downloads.
- Documents (for reference): Helvetica Neue, Arial fallback.

## Voice

Describe the business problem, the work and the next step in plain English:

- **Start with the business:** "We map the order process from quotation to payment."
- **Name the actual work:** "We review records, find gaps and agree the changes."
- **Be precise about progress:** "The draft is ready. The owner will confirm the next step."

Full writing rules: `binasys-company-context` (`reference/style-guide.md`).

## Charts, tables and graphics

- **Charts tell one story:** clear title, axes state the unit, labels stay horizontal, greys plus
  one blue accent series that highlights the point, source note names the period. Mark
  illustrative data as such.
- **Tables make ownership visible:** short wording, aligned columns, near-black header row with
  white text, soft-surface rows, a clear owner and next step.
- **Simple graphics explain the work:** diagrams for sequence, responsibility or a decision.
  Numbered steps use two digits (01, 02, 03) in grey with the current/key step in blue. Keep
  decoration restrained.
- **Photography** shows real people, real places and useful details. The logo and blue accent
  provide the brand character.

## On this website

- Header/footer logo: `src/_includes/partials/logo.njk` (wordmark-colour at 44 px high, switching
  to compact-colour at 48 px on screens ≤ 370 px). Set height only.
- Favicons and `tokens.css`: linked in `src/_includes/layouts/base.njk` with relative paths
  (`assets/brand/...`, no leading `/`).
- Details of CSS variables and site conventions: `binasys-site` skill.

## Brand compliance review

Check: right mark for the space, proportions, minimum size, clear space, background contrast,
palette-only colours, one blue emphasis, system font, voice. Report findings as a short list with
the fix for each.

## Troubleshooting

| Problem                                    | What to do                                                           |
| ------------------------------------------ | -------------------------------------------------------------------- |
| Logo looks blurry                          | Shown larger than its file size; make it smaller or ask the user for a larger export |
| Logo has a white box on a dark background  | Use the `-white` variant                                             |
| Need a logo/icon/format not listed above   | Ask the user to supply it; don't search elsewhere or create one      |
| Request for a new colour or logo variation | Not allowed without the brand owner; offer the closest approved option |
