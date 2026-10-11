# Learning Platform

Standalone React 19 + TypeScript + Vite website. This repository is independent
of the Java/Spring/Gradle sources that produce Java learning content.

## Requirements

- Node.js 22 (recommended)
- npm

## Run locally

```bash
npm ci
npm run test:data
npm run dev
```

The dev command downloads and verifies the latest Java release into
`dist/language/java/` before starting Vite. Vite serves this directory as
static assets while React supports Hot Module Replacement. Open the URL Vite
prints. No Java, Gradle or Spring Boot application is required.

## Build and preview

```bash
npm run build
npm run preview
```

The build runs TypeScript + Vite first (which clears `dist/`), then downloads
and validates the Java dataset. If the download, SHA-256, manifest or ZIP checks
fail, the command fails and the site must **not** be deployed. `dist/` is the
only runtime copy of learning data; it is ignored by Git. The production site
is the resulting `dist/` directory.
Cloudflare Pages can serve this directory and automatically falls back to
`index.html` for SPA navigation when no top-level `404.html` exists.
For **Cloudflare Workers Static Assets**, `wrangler.jsonc` configures
`assets.not_found_handling: single-page-application` for deep links such as
`/learning`, `/learning/java/knowledge/HIKARI_CP`, `/project`, and `/about-me`.
Do not add a catch-all `/* /index.html 200` rule to the Vite static assets:
Cloudflare may reject it as an infinite redirect loop during deployment.

## Learning data: per-language build artifacts

Java is produced exclusively by `java-learning`, not authored or committed in
this frontend repository. Its static dataset is downloaded into the generated
`dist/` folder alongside any future languages:

```text
dist/
  index.html
  assets/                      # Vite's JS/CSS, unrelated to Java sync
  language/
    java/
      module-catalog.json
      module/
      search/
    node/                      # future independent producer
    golang/                    # future independent producer
```

The content of the Java ZIP still uses producer-relative paths such as
`/module/FOO/knowledge/vi/index.json`; the frontend routes those requests to
`/language/java/module/FOO/knowledge/vi/index.json` at fetch time. The
React application routes and the Java release's original content do not need
to change. Other languages will have their own URL prefixes and consumers.

The Java repository now publishes validated data to the **rolling GitHub
Release tag `java-data`**. A standalone consumer is available for explicit
use, without requiring Gradle or Java:

```bash
npm ci
npm run test:data
npm run data:check    # download + validate ZIP, SHA-256 and manifest; no writes
npm run data:sync     # replace only dist/language/java after verification
```

The consumer downloads `java-learning-data.zip` and
`java-learning-data.zip.sha256` from
`phuongnguyenit93/java-learning/releases/tag/java-data`. It checks the full
ZIP checksum, source commit and manifest schema, catalog hash, file counts,
allowed static-data paths/extensions, and both language search indexes. It
retries up to three times if a rolling Release is briefly inconsistent while
assets are replaced. Any persistent failure aborts without changing `dist/language/java/`.

`data:sync` stages a complete replacement beside `dist/language/java/`
before switching that directory. It removes stale Java module data, keeps
unrelated Java-root files, and does **not** modify `dist/index.html`,
`dist/assets/` or future `dist/language/{other}/` directories. If a process
crashes leaving `dist/language/.java-data-stage/` or
`dist/language/.java-data-backup/`, inspect them before another sync.

The build/development scripts now use the same `dist/language/java/` output.
Vite serves it via `publicDir: 'dist'` during `npm run dev`, but disables
`publicDir` for production builds to avoid copying `dist/` into itself.
The Cloudflare configuration still deploys `./dist`; deploying is a separate
action and is **not** automatically triggered by this change.

## STEP 3.3 — GitHub Actions build and Cloudflare Workers Preview

Workflow: `.github/workflows/verify-and-preview.yml`

- Pushes to `main`, pull requests, Java publisher `repository_dispatch`
  events (`java-data-published`), and manual workflow dispatch run `npm ci`,
  `npm run test:data`, `npm run build`, and `node scripts/verify-dist.mjs`.
  A missing/corrupt/incomplete Java dataset fails the workflow, and the verified
  `dist/` folder is uploaded as a short-lived GitHub Actions artifact.
- **Neither push nor pull request deploys anything.** Cloudflare Preview
  requires manually running this workflow on `main` with
  `deploy_preview = true`. It uses `wrangler preview --name step-3-3`, never
  `wrangler deploy`, and checks the live HTML, Java catalog, VI/EN search and
  a real Knowledge index before reporting the Preview URL.
- On `java-data-published`, the build additionally checks that the Java
  Release manifest's source commit and downloaded ZIP SHA-256 match the
  producer's dispatched payload. Missing or stale release data fails the build
  rather than silently using another version.
- Configure repository or `preview` environment secrets named
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` first. The API token
  needs Cloudflare Workers editing privileges for the intended account.
  These secrets must never be committed to source.
- Cloudflare Workers Previews use an isolated URL and do not replace the
  production Worker deployment. This repo's `wrangler.jsonc` identifies the
  Worker as `learning-platform`; verify this matches the intended Cloudflare
  Worker before manually activating Preview. The static asset folder is
  `./dist` in either case.
- **STEP 4 (producer-to-consumer trigger), production deployment, and
  automatic Cloudflare promotion are intentionally not enabled.**

You can run the same last-mile artifact check locally after a full build:

```bash
npm run build
node scripts/verify-dist.mjs
```

## Scope and limitations

- Frontend only: no Spring Boot application, Java sources, Gradle wrapper, or
  Java build plugins are included.
- Java data is served from `/language/java/module-catalog.json`,
  `/language/java/module/**` and `/language/java/search/**`.
- **Local Run (build/download JAR)** needs an external backend. It is disabled
  by default in this standalone build. Do not set `VITE_ENABLE_LOCAL_RUN=true`
  until a compatible API is available at `/api/local-run/**`.
- The About Me PDF/DOC buttons and Google Docs viewer still link to the
  external Google document as before.
- The original `java-learning` source remains untouched by the copy.
