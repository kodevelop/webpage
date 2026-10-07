# Repository instructions

## Build, test, and deployment

- There is no package manifest or configured build, test, or lint script. No test suite or single-test command is defined.
- `.vscode/tasks.json` refers to `npm start` and `npm test`, but there is no `package.json` defining those scripts.
- GitHub Pages deploys the contents of `src/` when changes are pushed to `main`; `.github/workflows/main.yml` sets the site domain to `kodevelop.be`.

## Architecture

This repository is a static, single-page profile site. `src/index.html` contains the page markup, all styling, and the client-side language/rendering logic; the page's images are stored under `src/static/`. GitHub Pages publishes `src/` directly, so asset URLs in the page are relative to that directory.

The language selector renders content from the `translations` object in `src/index.html`. It supports English, Dutch, French, and German, preferring a saved `kde-language` value, then the browser language, then English.

## Repository conventions

- Keep the four locale entries in `translations` aligned: each should provide the same content fields, including the expertise and project lists. Keep their language codes in sync with the selector options.
- Expertise and project entries intentionally contain HTML (for example, `<strong>` and links) and are rendered with `innerHTML`; ordinary translated text is assigned with `textContent`. Preserve this distinction when editing content.
- Reference page images with paths relative to `src/index.html`, such as `./static/kodevelop-logo-horizontal.png`.
- `.editorconfig` sets UTF-8, two-space indentation, a final newline, and trimmed trailing whitespace. Markdown files do not trim trailing whitespace and have no configured line-length limit.
