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
| `src/_data/site.json`     | Navigation                                                               |
| `src/_data/business.yaml` | Company name, tagline, contact details                                   |
| `src/assets/css/site.css` | All site styles (brand colours mapped at the top)                        |
| `src/assets/js/`          | `navigation.js` (page transitions), `app.js` (menu, dialogs, tabs, hero) |
| `src/assets/brand/`       | Official logos, favicons and `tokens.css` from the brand kit. Read-only  |

Agents working on the site should use the `binasys-site`, `binasys-brand` and
`binasys-company-context` skills in `.opencode/skills/`.

## Deploying

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main`.
Pull requests only build and lint. The site is currently served from `/binasys-website/`, so all
paths are relative.

The custom domain `www.binasys.com.my` is registered. To switch to it:

1. Point DNS at GitHub Pages (`www` CNAME to `binasys.github.io`; apex A records to GitHub's Pages IPs).
2. Add `src/CNAME` containing `www.binasys.com.my` (already passed through by `eleventy.config.js`).
3. Set the custom domain and enforce HTTPS in the repository's Pages settings.
