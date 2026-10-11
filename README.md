# Learning Platform

Standalone React 19 + TypeScript + Vite website. This repository is independent
of the Java/Spring/Gradle sources that produce Java learning content.

## Requirements

- Node.js 22 (recommended)
- npm

## Run locally

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. No Java, Gradle, or Spring Boot application is
required.

## Build and preview

```bash
npm run build
npm run preview
```

The production site is in `dist/`, including the static Learning dataset.
Cloudflare Pages can serve this directory and automatically falls back to
`index.html` for SPA navigation when no top-level `404.html` exists.
For **Cloudflare Workers Static Assets**, `wrangler.jsonc` configures
`assets.not_found_handling: single-page-application` for deep links such as
`/learning`, `/learning/java/knowledge/HIKARI_CP`, `/project`, and `/about-me`.
Do not add a catch-all `/* /index.html 200` rule to `public/_redirects`:
Cloudflare may reject it as an infinite redirect loop during deployment.

## Learning data snapshot

The initial `public/` directory is a **copy** of the generated Portal data from
`java-learning/project-portal/build/generated/portal-data` at the time this
repository was separated:

```text
public/
  module-catalog.json
  module/
  search/
```

It contains the current Java module catalog and generated Knowledge, Roadmap,
Video, Quiz, Interview, Reference, and API metadata projections. It is a
standalone **static snapshot**; editing Java source does not update this
repository yet.

Only modules present in this generated snapshot are available in the new
website. For example, the snapshot copied during this migration contains
`HIKARI_CP`, but does not contain `THREAD`; the app falls back to an available
module when a requested module is missing. Refresh the snapshot from the Java
content builder later to include newly generated modules.

The Java repository now publishes validated data to the **rolling GitHub
Release tag `java-data`**. A standalone consumer is available for explicit
use, without requiring Gradle or Java:

```bash
npm ci
npm run test:data
npm run data:check    # download + validate ZIP, SHA-256 and manifest; no writes
npm run data:sync     # replace managed data under public/ after validation
```

The consumer downloads `java-learning-data.zip` and
`java-learning-data.zip.sha256` from
`phuongnguyenit93/java-learning/releases/tag/java-data`. It checks the full
ZIP checksum, source commit and manifest schema, catalog hash, file counts,
allowed static-data paths/extensions, and both language search indexes. It
retries up to three times if a rolling Release is briefly inconsistent while
assets are replaced. Any persistent failure aborts without changing `public/`.

`data:sync` stages a complete replacement beside `public/` before switching
the directory. It keeps unrelated public assets, removes stale Java module
files, and attempts rollback if switching folders fails. If a previous process
crashed and left `.public.java-data-stage/` or `.public.java-data-backup/`,
inspect and recover these directories rather than deleting them blindly.
**The current public data is Git-tracked**, so syncing it locally can create
thousands of changes in `git status`. Use `data:check` to validate without
updating the snapshot.

This is **STEP 3.1 only**: synchronization is not yet added to `npm run build`,
GitHub Actions or the Cloudflare deployment. The production snapshot remains
unchanged until the later integration step.

## Scope and limitations

- Frontend only: no Spring Boot application, Java sources, Gradle wrapper, or
  Java build plugins are included.
- Learning content is read from `/module-catalog.json`, `/module/**`, and
  `/search/**`.
- **Local Run (build/download JAR)** needs an external backend. It is disabled
  by default in this standalone build. Do not set `VITE_ENABLE_LOCAL_RUN=true`
  until a compatible API is available at `/api/local-run/**`.
- The About Me PDF/DOC buttons and Google Docs viewer still link to the
  external Google document as before.
- The original `java-learning` source remains untouched by the copy.
