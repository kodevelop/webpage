# Repository instructions

## Build, test, and deployment

- Install locked dependencies with `npm ci`.
- Run content and build tests with `npm test`; validate repository content with `npm run validate`.
- Build the deployable static site with `npm run build`, which writes ignored output to `dist/`.
- Preview the generated site with `npm start`.
- GitHub Pages runs the tests and build, then deploys `dist/` when changes are pushed to `main`; `.github/workflows/main.yml` sets the site domain to `kodevelop.be`.

## Architecture

This repository is a generated static, single-page profile site. `src/index.html` contains the page markup, styling, client-side language/rendering logic, and a `__SITE_CONTENT__` build token. Locale-specific profile text is stored in `content/<locale>/profile.yaml`, while each project is stored in a separate `content/<locale>/projects/<project-id>.yaml` file. The page's images are stored under `src/static/`.

`scripts/build.js` validates all content, embeds it into the generated `dist/index.html`, and copies static assets. The language selector supports English, Dutch, French, and German, preferring a valid saved `kde-language` value, then the browser language, then English.

## Repository conventions

- Keep the four locale directories aligned. Every locale must provide the same profile fields and expertise count, and every project identifier and order must exist in all four locales.
- Use lowercase kebab-case project filenames. Add a project by creating the same filename under each locale's `projects/` directory.
- Content is rendered with DOM APIs and `textContent`; project links are created from validated structured URL fields. Do not add raw HTML to YAML content.
- Reference page images with paths relative to `src/index.html`, such as `./static/kodevelop-logo-horizontal.png`.
- `.editorconfig` sets UTF-8, two-space indentation, a final newline, and trimmed trailing whitespace. Markdown files do not trim trailing whitespace and have no configured line-length limit.
