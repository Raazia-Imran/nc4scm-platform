# Studio security update

## Plain English for the client

The content editor used some older supporting software with known security warnings. We updated the editor and its supporting packages, and a fresh dependency scan now reports zero known vulnerabilities. This is maintenance of the editing system. The public website’s design, published content, domain and search settings are preserved.

A clean scan does not guarantee complete security. Editor account permissions, strong sign-in protection and sensible handling of uploaded files remain important.

## What changed

Baseline: main `7964546d4bb0e4ca508bef5343b040d58cd231cd`.

| Item | Before | Prepared update |
| --- | --- | --- |
| Sanity Studio / Vision | 3.99.0 in the existing lockfile | 6.21.0, matching versions |
| Editor React / React DOM | 18.3.1 | 19.3.1, matching versions |
| Node requirement | Not declared in Studio package | At least 22.12; existing GitHub runners already use 22 |
| Studio dependency findings | 28: 1 critical, 9 high, 18 moderate | 0 critical, 0 high, 0 moderate, 0 low |
| Structure plugin import | Deprecated sanity/desk | sanity/structure; same document structure |
| Search behavior | Older default | Explicit groqLegacy, preserving that behavior |

The public frontend retains its own React version. No content schema fields, document IDs, dataset/project identifiers, tokens, account roles, content import scripts, DNS or Search Console settings were changed. The existing Studio deployment hostname is retained.

## Why dependency overrides are present

Upgrading Studio removed the old archive-extraction dependency chain and other outdated packages. The current stable Studio release still brought in several vulnerable transitive versions. The package manifest therefore contains narrow, documented overrides using published fixes:

- `@vercel/frameworks` gets `js-yaml` 3.15.2 and `smol-toml` 1.9.1, retaining their existing major versions.
- Undici versions in the 7.x family use 7.30.1, retaining the major version.
- `@oclif/core` uses minimatch 11.0.1. This is deliberately scoped to that CLI consumer, which already uses the named `minimatch` API. A focused regression test verifies Sanity CLI plugin discovery through the actual oclif loader after the change. A global override across older, incompatible minimatch consumers was avoided.

No advisories were hidden, excluded, or downgraded. No forced audit downgrade or prerelease Sanity version was used. The scan includes the complete Studio dependency tree, not just production dependencies.

## Verification and limitations

- Clean `npm ci --ignore-scripts` installation: passed.
- Full Studio `npm audit --audit-level=moderate`: passed, zero reported vulnerabilities.
- Existing content regression suite: 17 passed, using local fixtures and no production content writes.
- CLI compatibility check: passed.
- Studio production build: passed.
- Schema extraction: passed, 29 exported entries including Sanity built-ins; source schema files remain unchanged.
- Built Studio login screen: passed at 320px and 1440px, without JavaScript page errors. Authentication provider responses are intercepted local fixtures. External writes are blocked; this test does not log into the real project.
- Screenshot of the mobile login screen reviewed.
- Public website regression and exact-commit GitHub/Vercel checks: inspect the associated pull request’s latest results; do not infer completion from this document’s preparation.

Authenticated editing, image upload and publishing to the real project require an authorized Sanity editor session and are not claimed as tested here. Before relying on a production upgrade, a project editor should confirm sign-in, opening an existing document, and editing/saving a draft. Publishing or uploading test content should use a designated test document/asset with owner approval. Existing automated deployment workflows preserve their previous guarded, one-time content-import behavior.

## Reproduce

In `cms-backend`, use Node.js 22.12 or later:

```bash
npm ci --ignore-scripts
npm run audit:security
npm run test:security
npm run test:content
npm run build
npx sanity schema extract --path /tmp/studio-schema.json
```

The browser smoke test runs after the frontend Playwright dependency/browser is installed:

```bash
node cms-backend/tests/studio-smoke.mjs
```

The production Studio deployment also requires the audit and CLI compatibility checks to pass. CI now runs the Studio audit and compatibility test before building, and the built Studio browser smoke test before the public website regression suite. A newly discovered advisory will fail the audit check rather than silently being accepted.

## Release and rollback

The change is prepared on a separate branch. Follow the associated pull request’s final release status for whether it has been merged/deployed. Do not call a prepared update a completed production release.

The project ID, production dataset and `studioHost: nc4scm-admin` remain as before. Do not create a new Sanity project or re-import content as an upgrade step.

If the deployed editor fails, revert the Studio upgrade commit through a new reviewed commit, then let the existing deployment workflow rebuild the previous Studio. Do not reset or force-push history. This restores the old editing software but also restores its known dependency warnings, so treat that as a temporary rollback while resolving the failure. No data migration was performed, and published content does not need to be rolled back for this code-only change.

## Official migration references

- https://www.sanity.io/docs/studio/upgrade
- https://www.sanity.io/docs/help/v3-to-v4
- https://www.sanity.io/docs/help/v4-to-v5
- https://www.sanity.io/docs/help/v5-to-v6
- https://www.sanity.io/docs/studio/deployment
- https://github.com/advisories/GHSA-g3hv-75wg-m249

Current clean audit: `dependency-audit-studio-remediated.json`. Historical baseline: `dependency-audit-studio.json`.
