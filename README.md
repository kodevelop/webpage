# Kodevelop webpage

This repository contains the source for the static profile site published at
`kodevelop.be`. GitHub Pages builds and deploys the site whenever changes are
pushed to `main`.

## Content structure

Translated content is stored under `content/<locale>/`, where the supported
locales are `en`, `nl`, `fr`, and `de`.

- `profile.yaml` contains the profile, expertise, section headings, and contact
  text for one locale.
- `projects/<project-id>.yaml` contains one localized project entry.
- A project filename is its stable identifier. The same filename must exist in
  every locale.
- The numeric `order` field controls project display order and must be unique
  within a locale.

To add a project, create the same YAML filename in all four project directories:

```text
content/en/projects/example-project.yaml
content/nl/projects/example-project.yaml
content/fr/projects/example-project.yaml
content/de/projects/example-project.yaml
```

Each project file has this structure:

```yaml
order: 50
title: Example project
url: https://example.com/project
description: A localized project description.
company: Example company
companyUrl: https://example.com/
```

The build fails when a locale or required field is missing, project identifiers
or ordering do not match across locales, expertise list lengths drift, project
orders are duplicated, an unsupported locale directory is added, or a project
URL does not use HTTP or HTTPS. This prevents incomplete translations from
being published.

## Local development

Install dependencies and validate the content:

```shell
npm ci
npm test
```

Build the deployable site in `dist/`:

```shell
npm run build
```

Build and preview it at `http://localhost:8080`:

```shell
npm start
```

Set the `PORT` environment variable to use a different preview port. The
generated `dist/` directory is ignored; YAML content and `src/index.html` are
the source of truth.
