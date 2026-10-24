# Learning Platform

Standalone React 19 + TypeScript + Vite website with a Cloudflare Worker Local
Run API and SQLite Durable Object coordinator. The former Spring Boot/React
`java-learning/project-portal/` application has been retired and deleted.
This repository is the **sole maintained website**, independent of Java source
compilation. The Java repository remains the data producer and JAR builder.

For product UX, frontend architecture, feature data contracts and current
implementation status, see [ARCHITECTURE.md](ARCHITECTURE.md).

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
For **Cloudflare Workers Static Assets** (the only maintained production host),
`wrangler.jsonc` configures
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

Modules with `content/code-explorer/material.yml` also publish a read-only
`code-explorer/` bundle: `index.json` (file tree and hashes), `symbols.json`,
`references.json`, `api-map.json` and allowlisted `files/**/*.java`.
The producer's `generatePortalData` builds these files automatically.
The consumer permits `.java` **only** inside the Code Explorer source
directory, validates each source SHA-256 against `index.json`, then places
the material at
`/language/java/module/<ROUTE_ID>/code-explorer/`. The module's
`codeExplorer` catalog field provides the producer-relative index path.
The React Monaco viewer is a separate UI feature; the material is already
available as static assets after a verified data build.

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
Cloudflare deploys `./dist`. GitHub Actions now uses only the **fully
verified** artifact for production; no rebuilding or re-downloading occurs
inside the deploy job.

## GitHub Actions — build, Preview and production

Workflow: `.github/workflows/verify-and-preview.yml`

- Pushes to `main`, pull requests, Java publisher `repository_dispatch`
  events (`java-data-published`), and manual workflow dispatch run `npm ci`,
  `npm run test:data`, `npm run build`, and `node scripts/verify-dist.mjs`.
  A missing/corrupt/incomplete Java dataset fails the workflow, and the verified
  `dist/` folder is uploaded as a short-lived GitHub Actions artifact.
- **Pushes to frontend `main` and verified Java `java-data-published`
  events auto-deploy production** after the build job succeeds. Both paths
  use `wrangler deploy` against the existing `learning-platform` Worker
  (with `wrangler.jsonc` unchanged), followed by HTTP smoke tests and
  SHA-256 byte-for-byte comparison of Java Knowledge, Catalog/Search and
  built Vite JS/CSS against the just-built artifact on both
  `https://learning-platform.phuongnguyenit93.workers.dev` and
  `https://nguyendodinhphuong.name.vn`. A mismatch fails the workflow.
- **Pull requests NEVER deploy.** Manual runs also never deploy production;
  they may deploy an isolated Preview only when `deploy_preview = true`.
  Preview uses `wrangler preview --name step-3-3` and checks live HTML,
  Java catalog, VI/EN search and a real Knowledge index.
- On `java-data-published`, the build additionally checks that the Java
  Release manifest's source commit and downloaded ZIP SHA-256 match the
  producer's dispatched payload. Missing or stale release data fails the build
  rather than silently using another version.
- The `java-learning` publisher sends this event only after uploading and
  re-downloading the verified Release. Configure its Actions secret
  `LEARNING_PLATFORM_DISPATCH_TOKEN` with a fine-grained GitHub token scoped
  **only** to the `learning-platform` repository, with **Contents: Read and
  write** (required for `repository_dispatch`). The producer's `GITHUB_TOKEN`
  is repo-scoped and cannot send an event to another repo. Without this
  secret, the publisher may succeed but its separate dispatch job fails visibly.
- Configure repository secrets named
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` first. The API token
  needs Cloudflare Workers editing privileges for the intended account.
  These secrets must never be committed to source.
- Cloudflare Workers Previews use an isolated URL and do not replace the
  production Worker deployment. This repo's `wrangler.jsonc` identifies the
  Worker as `learning-platform`; verify this matches the intended Cloudflare
  Worker before manually activating Preview. The static asset folder is
  `./dist` in either case.
- The Java publisher-to-consumer trigger and production promotion are
  enabled. If ZIP verification, build, or artifact validation fails, no
  deployment job runs. If a live endpoint differs from the artifact after
  publication, the production job fails visibly for investigation.

You can run the same last-mile artifact check locally after a full build:

```bash
npm run build
node scripts/verify-dist.mjs
```

## Scope and limitations

- React frontend + a small Cloudflare Worker API. There is no Spring Boot
  application, Java source, Gradle wrapper, or Java build plugin here.
- Java data is served from `/language/java/module-catalog.json`,
  `/language/java/module/**` and `/language/java/search/**`.
- **Local Run (build/download JAR)** is available for runnable modules without
  a legacy feature flag. Dispatch remains protected by the Cloudflare Worker:
  a server-side GitHub secret, published module/fingerprint validation, same-origin
  requests, Durable Object deduplication and rate limiting. Never expose the
  GitHub token to Vite or browser code.
- The About Me PDF/DOC buttons and Google Docs viewer still link to the
  external Google document as before.
- The original `java-learning` source remains untouched by the copy.

## Local Run Worker (Production)

`worker/index.ts` routes only `/api/*` into code; static assets and SPA routing
still use Cloudflare's `ASSETS` binding. `/api/local-run/build`, `/status`, and
`/artifact` follow the existing `src/data/localRun.ts` contract. The backend
validates module IDs and **published** source fingerprints, checks for an
existing Release JAR, reuses any current GitHub workflow, then limits and
dispatches a new build when necessary.

For read-only JAR availability, the browser now checks the **public, unauthenticated**
`java-learning` GitHub Release API first. One shared in-memory Release asset index
is paginated (100 assets/page) and cached for up to five minutes, with concurrent
lookups coalesced. Matching `moduleId · fingerprint:<SHA>` labels enable direct
GitHub download; a missing asset or mismatched label does **not** invoke Worker.
Only rate-limit responses (403 with rate-limit headers or a secondary-limit message,
429), network/CORS
failures, 5xx errors or unusable public metadata trigger the authenticated
`GET /api/local-run/artifact` fallback, with a cooldown to avoid repeating blocked
public calls. After Build returns `AVAILABLE` or finishes successfully, the browser
invalidates the cache and verifies the newly published artifact. The browser
never receives a GitHub token. Build dispatch and status polling **always** use
the Worker/Durable Object path.

The Local Run panel rechecks artifact metadata on entry (using the shared cache
while fresh), and when the browser tab becomes visible or regains focus after
five minutes since the last check. It does not poll continuously. A bilingual
**Refresh JAR Status** button forces a new lookup even before TTL expires;
refresh is disabled during an active check or build. Build `AVAILABLE` and
`SUCCESS` results also force an immediate cache invalidation and recheck.

Local Run's UI independently models **artifact verification**, **GitHub build
state**, and **Worker connection state**. Status 404 (no job) is not a missing
JAR or a service outage. Known POST rejections
(400/401/403/404/409/413/415/422/429) are actionable errors rather than
reconciliation attempts; HTTP 408, 5xx, and network timeouts trigger only
read-only status reconciliation, NEVER automatic duplicate POST. If an
uncertain POST is followed by a 404, dispatching again requires explicit
user acknowledgement after checking GitHub Actions. HTTP 429 displays a
Retry-After countdown. Progress is Submitting → Queued → Building →
Publishing JAR → Ready, with a validated GitHub Actions link. If Release
visibility is delayed, users can recheck; a new Build after a successful
run requires confirmation. Run instructions cover Windows/macOS/Linux,
clipboard errors, and opening localhost only after starting the JAR.

**Real modules** in the Learning sidebar means at least one content-count item
(Knowledge, Quiz, Interview or API Docs) for the active language. Roadmap
metadata, content paths and `hasContent` are not evidence of a counted item.
If the count summary is loading or unavailable, the sidebar does not prune
modules or guess at their counts; it shows the full tree with a loading/error
notice and a Retry control. Ancestor groups keep their catalog order.

Build progress labels have a stable height with a subtle circular pulse,
not animated trailing dots. While Queued/Building/Publishing the panel links
to the **exact GitHub Actions run** to inspect its steps; after Success/Failed
that same link remains available as **View build log**. A numeric run ID can
produce the trusted run URL when GitHub omits `html_url`; no generic workflow
listing is presented as though it were the specific run. Without a known run,
no fabricated log link is shown.


On reload or re-entry, the panel resumes any matching Durable Object job using
its deterministic `job-<fingerprint>` tracking ID via read-only `GET /status`.
It never repeats a POST /build just to reconnect. A 404 means no job for this
fingerprint. Status requests have 12-second HTTP timeouts; recoverable failures
back off, and after 90 seconds of continuous network failure polling pauses
with a **Reconnect Build Status** button. The frontend tracking deadline is
47 minutes (server-side build age limit: 45 minutes). After `SUCCESS` or
`AVAILABLE`, it retries fresh Release lookups for at most 45 seconds because
upload visibility can lag; build success is not confused with artifact
availability. Public JAR lookup remains usable if the Worker is offline.

The SQLite-backed `LocalRunCoordinator` Durable Object is keyed by module ID.
It writes a reservation BEFORE network requests to avoid concurrent duplicate
dispatches. When the GitHub response is uncertain, it does not retry blindly;
clients poll a `job-<fingerprint>` tracking ID while the object reconciles the
workflow. `BUILD_RATE_LIMITER` permits 3 **new dispatch decisions** per 60
seconds per Cloudflare-provided client IP at a Cloudflare location. This is
an abuse limiter, not a globally consistent distributed lock. Normal artifact
checks and status polls do not consume this quota. Visitors sharing an IP may
share this quota; real accounts or Turnstile can be added if public usage grows.

Cloudflare Rate Limiting uses eventually consistent, location-local counters,
not an exact three-request hard cap. On 2026-10-12, a Cloudflare Preview probe
using the separate Preview namespace `9217345` confirmed HTTP **429** with
`Retry-After: 60` after earlier accepted requests. The probe dispatched **no**
GitHub Actions workflows, and its Preview was deleted. The repeatable,
Preview-only probe is in `scripts/preview/`; it must be used with `wrangler
preview`, never `wrangler deploy`. Pass `--worker-name learning-platform`
explicitly when targeting this Worker's Preview. Bursts may temporarily exceed
three requests before the rate limiter catches up; Durable Object single-flight
still prevents duplicate dispatches for the same module. Rate limits are
per-IP/per-location, so multiple source IPs or Cloudflare locations can spend
separate quotas across different modules; consider Turnstile, authenticated
quotas, and GitHub Actions usage alerts before enabling public Build.

Run the following WITHOUT deploying or providing real credentials:

```bash
npm ci
npm run test:local-run
npm run test:worker
npm run check:worker
npm run check:wrangler   # Wrangler bundle dry-run only
npm run build
npx wrangler dev --local
```

Production Local Run requires `GITHUB_ACTION_TOKEN`, stored as a Cloudflare
Worker secret (never source, config or `VITE_`). Any Preview with a GitHub
secret can also dispatch builds; Preview URLs and credentials must therefore be
controlled. Missing credentials fail closed with HTTP 503. For long-term
operation, prefer a dedicated fine-grained GitHub token restricted to
`java-learning` (Actions Read/Write, Contents Read); rotate any broader
temporary token promptly. `wrangler secret put` without Preview scoping
changes Production: do not use it during Preview testing.

`wrangler.jsonc` uses declarative SQLite Durable Object `exports` plus Worker
Rate Limiting bindings; it does not require manually creating a namespace in
the Dashboard. No runtime build-enable variable or frontend feature flag is required.
Worker authorization and credential checks are independent of UI visibility.

### Cloudflare Preview (isolated bindings)

`previews.durable_objects.bindings` is **required** because the Worker accesses
the Coordinator through `env.LOCAL_RUN_COORDINATOR`: Cloudflare Preview does
not inherit production bindings. Preview SQLite state is automatically
isolated; Preview rate limit `namespace_id` is different from production to
avoid shared counters. The Preview must not be assumed to be build-disabled:
when its Worker has GitHub credentials, the same guarded API applies.

After authenticating via `npx wrangler login`, create/update the Preview only:

```bash
npx wrangler preview --name local-run-cloudflare-stage --ignore-base-config
node scripts/check-preview.mjs https://local-run-cloudflare-stage-learning-platform.phuongnguyenit93.workers.dev
```

The staged URL is
`https://local-run-cloudflare-stage-learning-platform.phuongnguyenit93.workers.dev`.
The remote static/SPA smoke check passed. A separate temporary Preview with
a deliberately invalid token confirmed SQLite Coordinator RPC returns 404
for a missing build; that temporary Preview was deleted.

**Historical one-build Preview smoke (2026-10-12):** Using a Preview secret
and an earlier temporary switch (since removed), `DATABASE_MYSQL` used published
fingerprint `15531e9071aef973942915c10d5757ac75c98f09`, matching the
repository's `main` Git tree. `POST /build` returned `DISPATCHED` and created
GitHub Actions [run 38203320041](https://github.com/phuongnguyenit93/java-learning/actions/runs/38203320041).
A second request returned `REUSED` with the **same** run ID, status polling
progressed `BUILDING` to `SUCCESS`, GitHub Release published `database_mysql.jar`
(22,547,875 bytes, HEAD HTTP 200), and a follow-up Build request returned
`AVAILABLE` without a new dispatch. The previous Preview build toggle is
no longer part of the architecture; this historical test does not imply that
new previews are disabled. Rate Limit bindings and logic are
tested locally but a multi-dispatch HTTP 429 was **not** tested against remote
Cloudflare, to avoid triggering unnecessary GitHub builds. No production
deployment or source commit/push was performed.
