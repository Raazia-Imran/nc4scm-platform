# Approved content imports

Approved client page content is read from Sanity Content Lake. Word seed files are migration inputs, never frontend fallback content. Shared interface defaults keep buttons and filters usable when a newly introduced CMS field has not yet been saved; explicit Studio values always override them.

## October 2026 Word update

`approved-content.source.json` records exact table values from `NC4SCM_Complete_Content_Master_Filled.docx` and its SHA-256. `prepare-approved-content.mjs` maps these to `approved-content.json`. Formatting cleanup only: trim surrounding whitespace, remove bullet markers when creating arrays, omit the stray standalone dot after one methods list. Wording, punctuation, British spelling and scientific claims are preserved.

The update covers global identity/footer/contact details; Services, Research, Events, News and Contact headings/intros; contact confirmation; all four service summaries, descriptions, methods, deliverables and order; and the Home services heading/introduction. Existing Home/About copy, team, publication citations, news/event records, images and galleries outside this form remain in Sanity.

Missing logos, service photographs and testimonial information are not invented. Incomplete testimonial records are hidden. Quotations appear only after both **Show on website** and **Quotation approved for publication** are enabled.

## Automatic publishing after merge

The existing **Deploy Sanity Studio** GitHub Action uses `SANITY_CONTENT_WRITE_TOKEN` (an Editor token) for content writes, falling back to `SANITY_AUTH_TOKEN` if absent. Studio deployment uses the existing `SANITY_AUTH_TOKEN` repository secret for project `dxinqb51`, dataset `production`. On `main`, it tests the source mapping, imports approved fields once and verifies them. Studio deployment still runs if content import fails, while the workflow remains failed so the uncompleted import is visible. A backup is saved as the **sanity-content-backup** workflow artifact for 30 days. Never put a write token in frontend variables, source code or chat.

The migration matches existing service slugs rather than assuming document IDs. It preserves assets, unrelated fields, contact roles and keys, and uses an atomic transaction with revision checks. Duplicate singleton/slug records or unpublished drafts stop the import before writes. Resolve those in Studio and rerun the failed action. The stored migration hash prevents later deploys from overwriting Studio edits. Changed inputs require a new migration version.

## Local preview and apply

From `cms-backend`, with an Editor token securely configured as `SANITY_CONTENT_WRITE_TOKEN` (or `SANITY_AUTH_TOKEN`):

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

### October 12 news and team update

`editorial-update.json` is a reviewed, one-time import recipe. It rewrites informational copy in an institutional voice, adds two Co-PI profiles after Dr Tariq Jamil, and creates two unique news articles. It also provides full body text and all 52 photographs retrieved from the nine linked original posts. Prof. Dr. Fayaz Hussain uses the supplied portrait; Dr Shamsoon Fareed's portrait remains empty at the client's request. Original URLs and source posting dates are recorded in the recipe. Earlier publication citations are unchanged. The entire green logo/process section has been removed from Home and its controls from Studio.

News cards on both Home and News open `/news/<slug>`. The original external source is a separate link within the article. Editors can add text and inline images under **Article Body**, and reorder additional photos under **Article photo gallery**. Inline images support alternative text and captions. New article slugs are required. Published article pages revalidate after 60 seconds.

The migration previews with `npm run seed:editorial:preview` and publishes with `npm run seed:editorial`. The deployment workflow applies it on `main`, using the existing Editor secret. Every affected field must still match its reviewed value; duplicate new slugs or changed published content stop the import before media upload. An unpublished draft is protected and skipped while unrelated records publish in a revision-guarded transaction. Each published record gets a marker so reruns preserve later Studio edits. The importer verifies saved values and writes a pre-import backup to the workflow artifact. The job remains red until the protected draft is reviewed and the last record is imported; then a final marker completes the migration.

Partner images render the complete source asset without applying photo crop or hotspot parameters. The logo surface preserves proportions using `object-fit: contain`.

`npm run test:content` checks Word mapping, full service lists, asset preservation, migration idempotence and draft/duplicate safeguards. The **Check CMS content and responsive UI** Action builds both apps and runs browser checks across 280–2560px, with local CMS responses and intercepted email delivery. Screenshots/report are uploaded as **responsive-ui-checks**. No test message is delivered to the client.

For local browser checks: install Playwright separately (`npm install --no-save --package-lock=false playwright@1.62.1` inside `frontend-ui`), run `npx playwright install chromium`, then `node tests/responsive.mjs`. This runner starts its own fixture API and production server; fixture content is not bundled into the deployed site.

After merge, verify **Deploy Sanity Studio** succeeded, then allow the site's 60-second CMS revalidation window and check the live Services page. A GitHub merge alone is not proof of a successful CMS import.

## Permission failure recovery

If the import reports `Insufficient permissions; permission "update" required`, the existing deploy token cannot write content. In Sanity project `dxinqb51` → API → Tokens, create an Editor token and save it directly in GitHub repository Settings → Secrets and variables → Actions as `SANITY_CONTENT_WRITE_TOKEN`. Do not send the token in chat. Rerun **Deploy Sanity Studio** from `main`. The failed atomic transaction changed no content and saved a backup.

### October 25 GCGC 2027 additions

`october-2026-additions.json` imports one upcoming Event and one News Article from the supplied GCGC 2027 poster. Both cover images are uploaded to Sanity as one shared image asset. The description and news body retain all three tracks, nine topic areas, proposed important dates, intended audience, author resources, website and enquiry email. No speakers, precise venue, fees or post-event outcomes were supplied; these optional fields stay empty.

The conference spans 10–11 April 2027 in Karachi. It is marked **Dates only — time not announced**; stored day boundaries support Upcoming/Past classification and do not claim session times. The news timestamp is the actual import time, not the call-for-papers opening date.

Preview with `npm run seed:october:preview`; publish with `npm run seed:october` using the existing Editor secret. The workflow runs this on `main`. Both records and a completion marker are created in one transaction. Existing IDs, slugs and drafts block the import; successful reruns preserve later Studio edits. The workflow retains a backup and verifies saved field values. Edit the published records under **Event** and **News Article**. The frontend reads Sanity, never this recipe.

The Team Member schema now also supports an **Additional public email**, displayed in the full profile when filled in Studio. No new RA personal records or portraits are included in this import.

## Compact team directory — October 25

The About page uses equal-height cards with white portrait surfaces, subtle hover depth, a short summary and up to three research tags. **Biography** opens the full profile, qualification, all research interests and public contact links. Close with the × button or Escape; keyboard focus returns to the opening button. Reduced-motion preferences disable the hover movement.

The one-time `import-team-directory-refresh.mjs --apply` migration updates 11 existing members, uploads five edited portraits and selects female illustrations for Ayesha Bint e Arif and Rumaisa Ali, whose photographs were withheld. Umer's most recently supplied portrait replaces his older one; his repeated form does not create another member. Full biographies and existing contact fields are preserved. The importer checks revisions and drafts, saves a backup, writes atomically, verifies the saved fields and records a completion marker. Subsequent workflow runs preserve later Studio edits.

### Add a member in Sanity

Open **Team Member → Create new document**, check for an existing record first, and complete the following fields. These are fields on a member record; no schema or code change is needed for each new person.

| Studio field | What to enter |
| --- | --- |
| Full Name | The person's approved display name. |
| Slug | Click **Generate** after entering the name; keep it unique. |
| Position / Role | For example, Research Assistant. |
| Team group | Select Research Assistants for an RA; use the matching leadership group for other roles. |
| Display Priority | A non-negative whole number; lower numbers appear first. Use the next available number for a new person at the end. |
| Avatar Image | An approved portrait with a white background. Leave empty if the person withholds their photo. |
| Alternative text | Describe the uploaded portrait, e.g. Portrait of [Full Name]. |
| Portrait placeholder | Choose Female illustration or Neutral illustration when Avatar Image is empty. This is a faceless drawing, not a photograph. |
| Short directory summary | Two short third-person sentences, ideally 35–45 words and at most 400 characters: qualification/current study first, then research focus. Include only supplied facts. |
| Research interests | Prefer three concise tags. Up to six can be saved; the first three appear on the card and all appear in the full profile. |
| Qualification summary | One line covering the completed degree and/or current programme. Leave empty if not supplied. |
| Biography | The complete approved third-person profile. It appears in the full-profile dialog and does not stretch the card. |
| Public email / Additional public email | Only addresses approved for public display; the additional address appears in the full profile. |
| LinkedIn URL / GitHub URL / Official academic profile | Approved full URLs; optional fields can remain empty. |
| ORCID URL / Google Scholar URL / ResearchGate URL | Add approved public researcher profile links. These fields are optional. |

Use this summary structure: **[Name] holds [qualification] / is pursuing [programme] at [institution]. Their research focuses on [two or three supplied areas].** Omit any part that was not provided; do not add qualifications or research interests to fill space.

Click **Publish**, allow the site's approximately 60-second revalidation window, then open **About → People** and test the new member's **Biography** button. Confirm the name, portrait/placeholder, research tags and links. If someone later supplies a photograph, upload it to Avatar Image; it takes precedence over the placeholder. A white card surface does not remove a coloured background inside a new uploaded image: prepare the portrait on white before uploading.

The four new fields are **Short directory summary**, **Research interests**, **Qualification summary** and **Portrait placeholder**. Existing Biography remains the full profile. Interface labels, including **Research focus**, **Biography** and **Close profile**, remain editable in **Global Site Settings → Website interface text**.
