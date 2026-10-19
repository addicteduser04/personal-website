# Sifeddine El Kadiri — Portfolio

A dependency-free portfolio for a Data & Finance Engineer. The cinematic overview leads from verified experience to 15 repository-audited project case studies and three dedicated recruiter-facing profiles.

## Local preview

Run a static server from the project root:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Architecture

- `index.html` contains the complete semantic page structure and indexable professional narrative.
- `quant/`, `data-ai/`, and `digital-transformation/` contain distinct, directly addressable professional profiles.
- `projects.js` is the shared project catalogue; `content/project-content.mjs` contains the repository-audited narrative, evidence, limitations, and pinned revision for every project.
- `scripts/generate-project-pages.mjs` builds 15 full static documents under `projects/`, plus `sitemap.xml` and `PROJECT_AUDIT.md`.
- `experience/` contains disclosure-safe case studies for Sterling Asset Management and AKWA GROUP.
- `script.js` handles progressive enhancement: navigation, reveal motion, project filtering, and video controls. Project links always navigate to canonical pages.
- `case-study.js` and `case-study.css` provide shared navigation, contents tracking, and responsive presentation for project and experience pages.
- `profile.js` curates evidence-based project, experience, and skill content for each profile; `profile.css` supplies their coordinated visual system.
- `styles.css` contains the responsive design system and reduced-motion treatment.
- `assets/media/` contains optimized desktop/mobile versions of the supplied hero video and poster frames extracted from that video.
- `tests/portfolio.test.mjs` checks content integrity, all 15 generated routes, media wiring, factual safeguards, and SEO configuration.

## Content safeguards

The internship figures previously marked as pending documentary confirmation are intentionally not presented. Each project page is generated from public repository evidence pinned to a commit in `content/project-content.mjs`; absent benchmarks and operational metrics are labelled as missing instead of inferred. Employer pages remain high-level and exclude confidential data, code, and performance claims. No public CV file is included, so every CV action opens a pre-addressed email request instead of a broken download.

## Verification

```bash
node scripts/generate-project-pages.mjs
node --check script.js
node --check profile.js
node --check case-study.js
node --check projects.js
node --test tests/*.mjs
```

## Deployment

The site remains compatible with Vercel static hosting. `/quant`, `/data-ai`, `/digital-transformation`, `/experience/:slug`, and `/projects/:slug` resolve to independent static documents and support direct refreshes.
