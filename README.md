# astro-portfolio-theme

A portfolio site built with Astro 6, Tailwind CSS 4 and TypeScript. All content lives in JSON files. The build produces a static site in `dist/`, with no backend and no CMS.

The site has two languages: Polish (default, at `/`) and English (at `/en`). A button in the header switches between them.

---

## How this repo is used

- Branch `main` holds the source code. Edit content and code here.
- Branch `built` holds only the contents of `dist/`. GitHub Pages serves the site from this branch, with a custom domain set by a `CNAME` file.
- The build runs locally. There is no Docker and no CI.

---

## Requirements

- Node 24 or newer
- pnpm 11 (`corepack enable` installs the version in `package.json`)

---

## First-time setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set your domain in `public/CNAME`. The file must contain only the domain, on one line:

   ```
   yourdomain.com
   ```

3. Fill in your content (see "Content" below).

4. Add your Web3Forms access key in `src/data/pl/site.json` and `src/data/en/site.json` (`web3formsKey`). The contact form needs it.

---

## Daily work

```bash
pnpm run dev
```

- Polish: http://localhost:4321
- English: http://localhost:4321/en

Optional checks:

```bash
pnpm run lint        # ESLint
pnpm run typecheck   # astro check
```

`pnpm run dev` and `pnpm run build` first run `scripts/download-assets.mjs` (see "Assets" below).

---

## Content

All text lives in `src/data/<language>/`. Each language has its own copy of the same files, so update both `pl/` and `en/`.

| File | Controls |
| ---- | -------- |
| `personal.json` | Name, bio, contact details, social handles, hero role, photo |
| `site.json` | Site title, SEO description and keywords, Web3Forms key, service cards, footer text |
| `expertise.json` | Expertise cards |
| `skills.json` | Skill categories and icons |
| `portfolio.json` | Client work with image slides |
| `projects.json` | Personal projects. `layout` is `grid` (6+ projects) or `showcase` (5 or fewer) |
| `certifications.json` | Credentials and training |
| `menu.json` | Navigation labels |
| `ui.json` | Fixed interface text: buttons, headings, labels, form messages |

Notes:

- Social handles left empty (`""`) are hidden automatically.
- `skills.json` icons use the format `prefix:name` (for example `simple-icons:figma`). You can also use a local path that starts with `/`.
- The privacy and terms pages are in `src/components/PrivacyPage.astro` and `src/components/TermsPage.astro`. The text is a placeholder. Rewrite it for each language.
- Country in the Schema.org data is set in `src/layouts/Layout.astro` (`addressCountry`).

### Images and files

Put files in `public/`. Paths in the JSON files start with `/` and are relative to `public/`.

| Folder | Use |
| ------ | --- |
| `public/images/personal/` | Portrait (`personal.json` → `photo`) |
| `public/images/portfolio/` | Images for `portfolio.json` |
| `public/images/projects/` | Images for `projects.json` |
| `public/images/favicons/` | Favicons |
| `public/cv/` | CV (PDF, DOC, DOCX). The first file is found automatically |

Also check `public/manifest.json`, `public/browserconfig.xml` and `public/robots.txt`.

### Remove a section

Open `src/components/HomePage.astro` and delete the component and its `<SectionDivider />`. Then remove the matching entry from `menu.json` in each language.

### Project images from GitHub (optional)

If a project has `githubRepo` set and `GITHUB_USER` is set in `.env`, the build takes the first real image from that repo's README. This is off by default. To skip it, use local images and leave `githubRepo` empty or out.

```env
GITHUB_USER=your-github-username
GITHUB_TOKEN=ghp_xxxx   # optional, raises the API limit from 60 to 5000 per hour
```

`.env` is in `.gitignore`.

---

## Languages (i18n)

- Default language: `pl`, served at `/`. English: `en`, served at `/en`.
- The language is not detected. The visitor chooses with the header button. The pages also include `hreflang` links for search engines.
- Add a language:
  1. Copy `src/data/pl/` to `src/data/<code>/`.
  2. Add the code to `i18n.locales` in `astro.config.mjs`.
  3. Register it in `src/lib/i18n.ts` (imports, `locales`, `htmlLang`, `ogLocale`, `data`).
  4. Copy `src/pages/en/` to `src/pages/<code>/`.
- Images and icons are shared between languages.

---

## Assets

`scripts/download-assets.mjs` runs before `dev` and `build`. It downloads only what is missing:

- the Inter font, to `public/fonts/` (ignored by git)
- skill and project icons, to `public/images/icons/`
- project images from GitHub, only if `GITHUB_USER` is set

It needs network access. If a download fails, it prints a warning and the build continues. Icons that you no longer use stay on disk. Delete them by hand.

Social and expertise icons are not files. The browser loads them from Iconify (`code.iconify.design`) at runtime.

---

## Build and deploy

1. Build with your domain:

   ```bash
   SITE_URL=https://yourdomain.com BASE_PATH=/ pnpm run build
   ```

   - Output goes to `dist/`.
   - `public/CNAME` and `public/.nojekyll` are copied into `dist/`.
   - `SITE_URL` sets canonical URLs, `hreflang` and Open Graph links.

2. Preview the result (optional):

   ```bash
   pnpm run preview
   ```

3. Replace everything in the `built` branch with the contents of `dist/` (not the `dist` folder itself). Remove old files first, so deleted pages do not stay online. Push the branch.

4. GitHub Pages redeploys on its own.

### One-time GitHub and DNS setup

- Repo → Settings → Pages → Source: Deploy from a branch → branch `built`, folder `/ (root)`.
- Custom domain: the `CNAME` file sets it. You can also enter the same domain in the Pages settings.
- Turn on Enforce HTTPS.
- DNS at your domain provider:
  - Root domain: four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
  - `www`: a `CNAME` record pointing to `your-username.github.io`, or to the root domain.
- `.nojekyll` is needed. Without it, GitHub's Jekyll step skips the `_astro/` folder and the CSS and JS return 404.

---

## Project structure

```
src/
├── components/   Sections (Hero, About, ...), HomePage, PrivacyPage, TermsPage
├── data/         Content: pl/ and en/
├── layouts/      Layout.astro (head, SEO, hreflang)
├── lib/          i18n.ts, socialLinks.ts, icons.ts, fetchGitHub.ts, assetPath.ts
├── pages/        index, privacy, terms (pl) and en/ (same pages)
└── styles/       global.css
scripts/          download-assets.mjs
public/           Static files copied as-is into dist/
```

---

## Scripts

| Command | Action |
| ------- | ------ |
| `pnpm run dev` | Dev server at http://localhost:4321 |
| `pnpm run build` | Build to `dist/` |
| `pnpm run preview` | Serve `dist/` locally |
| `pnpm run lint` | ESLint |
| `pnpm run lint:fix` | ESLint with fixes |
| `pnpm run typecheck` | Astro type check |

---

## Dependency safety

`pnpm-workspace.yaml` holds the pnpm security settings. They are:

- a 7-day wait before new package versions are used
- blocked install scripts, except for `esbuild` and `sharp`
- blocked git and tarball sub-dependencies

Leave this file in place. The install needs the `allowBuilds` list.
