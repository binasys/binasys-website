# Binasys website

Static website for Binasys. Plain HTML, CSS and JavaScript; [Eleventy](https://www.11ty.dev/)
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

CSS and JavaScript URLs include a content hash from `src/_data/assetUrls.js`, so browsers fetch
the matching assets when a new version is deployed.

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

| File                      | What it controls                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `business.yaml`           | Company name, tagline, office, email, phone, registered name and SSM number, LinkedIn                          |
| `company.yaml`            | Company overview and values on About us; homepage company summary                                              |
| `steps.yaml`              | Business review, scope and proposal, implementation, and follow-up on Our approach                             |
| `services.yaml`           | AI & automation, Strategy & business consulting, and Marketing & growth; cards, dialogs and homepage summaries |
| `industries.yaml`         | Sector tabs and example applications on Industries                                                             |
| `caseStudies.yaml`        | Approved case studies only; the section stays hidden while the list is empty                                   |
| `team.yaml`, `proof.yaml` | Retired public profile/proof collections; intentionally empty                                                  |

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
Pull requests only build and lint. The live custom domain is https://binasys.com.my/ (`src/CNAME`); `basePath` is `/`.
Site links use root-relative paths such as `/services`.

The primary navigation is About us, Services, Industries and Our approach. The logo links home;
Contact us is a separate action. About us describes the company and its values, without personal
profiles or photographs. Marketing includes strategy and execution, including campaigns and websites.

Keep service IDs `work` and `sales` stable for existing bookmarks. The former analytics dialog
`#service-clarity` opens AI & automation; analytics supports the current services. `/about#approach`
and the legacy homepage `#approach` redirect to `/approach`.

Only add case studies to `caseStudies.yaml` with client approval and sourced scope/outcomes.
Industry applications are examples, not claims of completed client work.
