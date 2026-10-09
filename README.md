# Sifeddine EL KADIRI — Portfolio

A dependency-free, data-driven portfolio spanning quantitative finance, data science and AI, and IT/digital transformation.

## Local preview

Run any static server from the project root, for example:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`. The production Vercel configuration rewrites shareable profile and case-study paths to the application shell.

## Content architecture

- `projects.js` is the source of truth for profile positioning and project case studies.
- `script.js` contains shared renderers, navigation, filters and interactive visualizations.
- `assets/projects/` contains genuine public-repository assets used by the case studies.
- `vercel.json` enables refreshable direct routes without intercepting static assets.

## Adding a project

Add one project object to `PORTFOLIO_DATA.projects`, including a unique `slug`, verified repository facts, and related project slugs. It will automatically appear in the library, search, filters, and reusable case-study renderer. Add its URL to `sitemap.xml` for indexing.

## Profile CV configuration

No resume PDFs were present during implementation, so profile pages intentionally show “Profile CV · available on request” instead of broken links. To enable downloads:

1. Add the PDFs under `assets/resumes/`.
2. Set each profile’s `cv` property in `projects.js`, for example `cv: "/assets/resumes/sifeddine-quant-cv.pdf"`.

## Deployment

The project is prepared for Vercel as a static site. No production deployment or Git push is performed by this workspace task.
