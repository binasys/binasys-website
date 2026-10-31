# Binasys website

Static website for Binasys ("Business, better."). Plain HTML, CSS and JavaScript; [Eleventy](https://www.11ty.dev/)
runs only at build time to wrap each page in a shared layout. The output in `dist/` is plain static
files.

## Working on it

```sh
npm install
npm start        # http://localhost:8080 with live reload
npm run build    # writes dist/
npm run format   # Prettier
npm run lint     # format check + Stylelint + build + HTMLHint
```

Edit files in `src/`, never `dist/`.

| Path                      | What                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `src/*.html`              | One file per page: front matter + `<main>` content                       |
| `src/_includes/layouts/`  | `base.njk`: `<head>`, favicons, CSS/JS, header, footer, dialogs          |
| `src/_includes/partials/` | Header, footer, logo, contact dialog, service dialog                     |
| `src/_data/site.json`     | Navigation, legal links, `basePath` for the 404 page                     |
| `src/_data/*.yaml`        | Editable content (see "Editing content")                                 |
| `src/assets/css/site.css` | All site styles (brand colours mapped at the top)                        |
| `src/assets/js/`          | `navigation.js` (page transitions), `app.js` (menu, dialogs, tabs, hero) |
| `src/assets/brand/`       | Official logos, favicons and `tokens.css` from the brand kit. Read-only  |

## Editing content

Most content lives in plain-text YAML files in `src/_data/`. Each file starts with notes on how to
edit it. You can edit them on GitHub (open the file, click the pencil icon, then "Commit changes");
the site rebuilds and updates in a few minutes.

| File              | What it controls                                                                      |
| ----------------- | ------------------------------------------------------------------------------------- |
| `business.yaml`   | Company name, tagline, office, email, phone, registered name and SSM number, LinkedIn |
| `team.yaml`       | The founders on the About us page                                                     |
| `steps.yaml`      | "How we work" steps on the About us page                                              |
| `services.yaml`   | Services: cards and pop-ups on "How we help", summary cards on the home page          |
| `industries.yaml` | Industry tabs on "Your business"                                                      |

YAML tips: keep the indentation exactly as it is (spaces, not tabs); lines in a list start with
`- `; put text in quotes if it contains a colon (`:`). If the site fails to build after an edit,
the GitHub Actions log shows which line is wrong.

Legal pages (`src/privacy.html`, `src/privasi.html`, `src/terms.html`) are normal pages; update the
`updated:` date at the top when you change them, and keep the English and Bahasa Malaysia privacy
notices in step.

Agents working on the site should use the `binasys-site`, `binasys-brand` and
`binasys-company-context` skills in `.opencode/skills/`.

## Deploying

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main`.
Pull requests only build and lint. The site is currently served from `/binasys-website/`, so all
paths are relative.

The custom domain `www.binasys.com.my` is registered. To switch to it:

1. Point DNS at GitHub Pages (`www` CNAME to `binasys.github.io`; apex A records to GitHub's Pages IPs).
2. Add `src/CNAME` containing `www.binasys.com.my` (already passed through by `eleventy.config.js`).
3. Change `basePath` in `src/_data/site.json` to `/` (used by the 404 page).
4. Set the custom domain and enforce HTTPS in the repository's Pages settings.
