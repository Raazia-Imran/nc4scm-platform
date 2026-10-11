# Approved content imports

The website reads only Sanity Content Lake. Seed files are migration inputs, never frontend fallback content.

## October 2026 Word update

`approved-content.source.json` records exact table values from `NC4SCM_Complete_Content_Master_Filled.docx` and its SHA-256. `prepare-approved-content.mjs` maps these to `approved-content.json`. Formatting cleanup only: trim surrounding whitespace, remove bullet markers when creating arrays, omit the stray standalone dot after one methods list. Wording, punctuation, British spelling and scientific claims are preserved.

The update covers global identity/footer/contact details; Services, Research, Events, News and Contact headings/intros; contact confirmation; all four service summaries, descriptions, methods, deliverables and order; and the Home services heading/introduction. Existing Home/About copy, team, publication citations, news/event records, images and galleries outside this form remain in Sanity.

Missing logos, service photographs and testimonial information are not invented. Incomplete testimonial records are hidden. Quotations appear only after both **Show on website** and **Quotation approved for publication** are enabled.

## Automatic publishing after merge

The existing **Deploy Sanity Studio** GitHub Action uses the existing `SANITY_AUTH_TOKEN` repository secret for project `dxinqb51`, dataset `production`. On `main`, it tests the source mapping, imports approved fields once, verifies them, and deploys Studio. A backup is saved as the **sanity-content-backup** workflow artifact for 30 days. Never put a write token in frontend variables, source code or chat.

The migration matches existing service slugs rather than assuming document IDs. It preserves assets, unrelated fields, contact roles and keys, and uses an atomic transaction with revision checks. Duplicate singleton/slug records or unpublished drafts stop the import before writes. Resolve those in Studio and rerun the failed action. The stored migration hash prevents later deploys from overwriting Studio edits. Changed inputs require a new migration version.

## Local preview and apply

From `cms-backend`, with an Editor token securely configured as `SANITY_AUTH_TOKEN`:

```bash
npm run test:content
npm run seed:approved:prepare
npm run seed:approved:preview
npm run seed:client
```

Preview does not write. The final command applies and verifies. Local backups go to ignored `seed/backups/`.

## New empty datasets only

`npm run seed:bootstrap` imports earlier approved site copy/media with `--missing`. Then `npm run seed:client` applies the latest Word update. Import citations with `sanity dataset import seed/publications.ndjson production --missing`. Do not use `--replace` on a client-edited dataset.

## Client editing guide

- **Global Site Settings → Website interface text**: labels, filters, buttons and form messages.
- **Page Headings & Contact**: main introductions and contact confirmation.
- **Service**: title, slug, summary, optional approved image/alt text, description and complete methods/deliverables.
- **Home / About**: existing sections, timeline, mission/vision, headings and actions.
- **Event**: start/end time, venue, cover, speakers; add recap and gallery/captions after the event. Multi-day events move to Past after the end time.
- **News Article / Publication / Team Member / Institutional Partner**: their own editable records.

The Word form provides no replacement publications, article bodies, event recaps, portraits or photographs. Earlier client-supplied publication citations stay unchanged.

## Verification

`npm run test:content` checks Word mapping, full service lists, asset preservation, migration idempotence and draft/duplicate safeguards. The **Check CMS content and responsive UI** Action builds both apps and runs browser checks across 280–2560px, with local CMS responses and intercepted email delivery. Screenshots/report are uploaded as **responsive-ui-checks**. No test message is delivered to the client.

For local browser checks: install Playwright separately (`npm install --no-save --package-lock=false playwright@1.62.1` inside `frontend-ui`), run `npx playwright install chromium`, then `node tests/responsive.mjs`. This runner starts its own fixture API and production server; fixture content is not bundled into the deployed site.

After merge, verify **Deploy Sanity Studio** succeeded, then allow the site's 60-second CMS revalidation window and check the live Services page. A GitHub merge alone is not proof of a successful CMS import.
