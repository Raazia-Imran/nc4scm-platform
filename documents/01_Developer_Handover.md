# NC4SCM Developer Handover

24 November 2026 | Asia/Karachi | Version 1.0

## Project and current checkpoint

Purpose: let a future developer or AI assistant resume the institutional website and its related conference site without relying on this chat. Readers: the incoming maintainer and Raazia Imran Reshamwala. This is a documentation checkpoint; it is not client acceptance or proof that every feature is complete.

VERIFIED FROM REPOSITORY: NC4SCM presents centre information, people, services, publications, events and news. Its repository contains a Next.js public website and a separate Sanity Studio. GCGC 2027 has a separate React/Vite repository; only keynote profiles are synchronized from Sanity during its build.

USER-PROVIDED NOTE: the client is receiving a mostly completed website. Hosting and source are currently under the developer; Namecheap and Search Console are described as client-controlled. The requested deliverables are this guide, a client CMS manual with admin links, and a migration plan. No deadline, rubric or page limit was supplied.

| Evidence | Current finding |
| --- | --- |
| VERIFIED FROM REPOSITORY | Platform main: 4a72f66914b5ee8678c5dd7ae230efcdc9e70f35; latest commit dated 13 November 2026. |
| VERIFIED FROM REPOSITORY | Conference main: df08a481753c7236a3025c3923eebd23b727b4f8; latest commit dated 14 November 2026. |
| VERIFIED FROM CURRENT FILE | Both public homepages returned HTTP 200 on 24 November. Apex redirected to www. This is an availability observation, not a full browser audit. |
| VERIFIED FROM CURRENT FILE | Public Sanity API: project dxinqb51, production. GCGC event is 16-17 April 2027, dates only; Dr. Fernando Martirena and Dr. Sofía Sánchez Berriel. |
| UNRESOLVED | The connected Vercel inventory omits the custom domains. Actual domain-owning projects/scopes must be located before migration. |

### Success criteria

Approved CMS edits reach the main site; both public domains and existing URLs remain available; the client can administer source, hosting, CMS and domain independently; historical authorship remains intact; no private credentials enter the documents.

Evidence labels used throughout: VERIFIED FROM CURRENT FILE = directly inspected source or saved response; VERIFIED FROM REPOSITORY = cloned Git source; USER-PROVIDED NOTE = requester or earlier chat; INFERENCE = reasoned recommendation; UNRESOLVED = not established. API observations are recorded in the evidence file with their limitations.


## Source of truth and architecture

| Component | Authoritative location and role |
| --- | --- |
| Platform source | https://github.com/Raazia-Imran/nc4scm-platform | main |
| Public frontend | frontend-ui/ | Next.js 15.5.28; React ^18.3.1; server-rendered pages and 60-second regeneration. |
| CMS editor | cms-backend/ | Sanity Studio v3; schemas in schemaTypes/. Dataset content is hosted by Sanity, outside Git. |
| CMS connection | frontend-ui/src/sanityClient.js | GROQ read client, published perspective, private server token boundary. Images use src/lib/image-url.js. |
| Conference source | https://github.com/Raazia-Imran/nc4scm-conference | main; Vite, React, TypeScript. Root directory is repository root; output dist. |
| Conference CMS bridge | scripts/sync-keynotes.mjs reads event-gcgc-2027 from dxinqb51/production at build time. src/conference-content.json is the reviewed fallback. |
| Deployment automation | Platform .github/workflows/deploy-sanity-studio.yml deploys Studio AND runs guarded content imports. Website hosting is a separate Vercel deployment. |

VERIFIED FROM CURRENT FILE: inspected older file D:\PROJECTS DATA\NC4SCM_Project_Handover_2026-10-26.md. It is historical context. Current source supersedes its Next.js 14 version, 10-11 April conference dates and absence of dedicated ORCID fields. Current team schema supports ORCID, Google Scholar and ResearchGate.

VERIFIED FROM REPOSITORY: public label is Centre Archive; route remains /legacy and schema/older filenames retain legacy naming. Do not rename stored IDs or URLs merely to match the label.

VERIFIED FROM CURRENT FILE: public response counts: 15 team documents, including 1 explicitly hidden; 13 publications, 10 news articles, 3 events, 4 services, 3 partners; 92 image assets and 1 file asset. These are dataset counts, not visible-card counts or a complete backup. No published contributionProject/practicalContribution/legacyPage records appeared in the type snapshot.

UNRESOLVED: private drafts, roles, tokens, CORS, client original forms and complete earlier chats were not accessible through this read-only snapshot. No source code changes, CMS writes, repository pushes, deployments or application tests were performed.


## Setup and safe maintenance

VERIFIED FROM REPOSITORY: clone the existing repository; do not follow the generic README steps that initialize a new Git or Sanity project. Keep project dxinqb51 and dataset production unless an independently approved migration requires otherwise.

```bash
git clone https://github.com/Raazia-Imran/nc4scm-platform.git
cd nc4scm-platform/frontend-ui
npm ci
npm run dev
# Separate terminal: cms-backend -> npm ci -> npm run dev
```

Create frontend-ui/.env.local from .env.example. These public identifiers are not passwords:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=dxinqb51
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Only if the existing dataset is private, configure SANITY_API_READ_TOKEN as a private hosting/local secret. NEXT_PUBLIC_FORM_ENDPOINT is optional; the current fallback is FormSubmit using the CMS recipient. Never prefix a private token with NEXT_PUBLIC_. Studio uses SANITY_STUDIO_PROJECT_ID=dxinqb51 and SANITY_STUDIO_DATASET=production.

VERIFIED FROM REPOSITORY: Studio hostname is nc4scm-admin. CI references SANITY_AUTH_TOKEN and SANITY_CONTENT_WRITE_TOKEN. Repository copies do not carry secret values. A new CI run may execute historical import steps: inspect guards, completion markers, current drafts and revisions before enabling Actions on a copied repo.

### Files to inspect before editing

AGENTS.md; root README.md; the target schema, query and component; cms-backend/seed/README.md; relevant importer and approved source; docs/SECURITY-PRIVACY-SEO.md; docs/LIVING-LEGACY-GUIDE.md; docs/GCGC-KEYNOTES.md; current workflow and package lockfiles. Read current published documents and drafts before any content patch.

Conference setup: npm ci, npm run dev from its root. Maintain src/App.tsx, src/data.ts and src/page-meta.json; poster is public/images/gcgc-2027-poster.webp. Preserve public/google6cebf148146998e0.html and generated allowlisted routes. Dates also exist in metadata, structured data and artwork.

For future releases use repository-required checks and review the preview before deployment. This checkpoint did not rerun them. Platform README requires a frontend production build; conference README specifies typecheck, lint, build, check and browser checks. Do not equate build success with live content or email delivery.


## Decisions and unfinished work

### Preserve these decisions

- VERIFIED FROM REPOSITORY: concise third-person member cards with full biographies; approved white-background portraits; neutral/female illustrations when a photograph is withheld. Keep stable IDs, including team-razia.

- VERIFIED FROM REPOSITORY: contract status/end date controls former-member classification in Asia/Karachi. Hide overrides both directories; lasting credit preserves an accurately labelled contribution card. Never delete a person merely because a contract ended.

- VERIFIED FROM REPOSITORY: About timeline photographs feed Events > Journey in pictures. Archive projects and practical contributions require publication approval. Empty years/sections remain honest empty states.

- VERIFIED FROM REPOSITORY: main-site content generally refreshes through caching. Conference keynote edits require a conference rebuild; poster and most conference copy remain release-controlled static source.

- USER-PROVIDED NOTE: preserve authorship and keep both developer and client repositories. ZIP upload/new initial commit is rejected for migration because it loses commit history. No silent publishing or remote access without authorization.

### Known issues and limits

VERIFIED FROM REPOSITORY: docs/SECURITY-PRIVACY-SEO.md contains an older Studio audit with 28 findings (1 critical, 9 high, 18 moderate). A remediation commit afd515d exists on fix/sanity-studio-security but is not an ancestor of current main. Treat remediation as unfinished on main; do not report the branch as merged or the historical audit as a fresh scan.

UNRESOLVED: actual custom-domain project mapping; production SHA; authenticated Sanity ownership; Search Console verified-owner list; DNS zone/verification records; form activation and mailbox delivery; current operator approval of policy notices.

VERIFIED FROM REPOSITORY: conference README still lists decisions awaiting organizer approval: submission portal, final venue/address, programme times, fees/payment rules, committee members, partner logos and accommodation details. A working contact form UI does not prove delivery. No public registration/payment backend is implemented by this handover.

USER-PROVIDED NOTE: Raazia is the outgoing developer. Dr. Tariq Jamil is identified in prior notes as PI/contact. Current authorized client account owner and final content approver are UNRESOLVED; do not assign approval or completion to a named person without evidence.

Source documents record historical local checks. None are new test results from this handover. Repository presence proves implementation, not that every field is deployed in the authenticated editor or approved by the client.


## Resume here and evidence links

INFERENCE: the single best next step is a read-only ownership reconciliation for nc4scm.com, www.nc4scm.com and gcgc.nc4scm.com. Expected output: one table with hostname, actual Vercel team/project, production deployment SHA, linked Git repository/branch, DNS provider, existing records and verification method. Stop migration work if ownership cannot be established.

Then follow 03_Account_Migration_Guide.pdf: prepare client-owned accounts, duplicate repositories with history, preserve the same Sanity dataset, transfer verified hosting projects and reconnect Git. Execute account changes only after explicit authorization for that stage.

| Priority | Next output |
| --- | --- |
| 1 | Verified domain-to-project map and pre-change baseline. |
| 2 | Client owner/access register with no secrets; sanitized configuration inventory and secure CMS backup. |
| 3 | History-preserving client repository copies with Actions reviewed; compare refs and authorship. |
| 4 | Tested client hosting ownership and next deployment; signed acceptance before developer access removal. |
| 5 | Resolve Studio remediation branch and remaining conference content through separate reviewed work. |

### Essential links

| Use | Address |
| --- | --- |
| Platform repository | https://github.com/Raazia-Imran/nc4scm-platform |
| Conference repository | https://github.com/Raazia-Imran/nc4scm-conference |
| CMS editor | https://nc4scm-admin.sanity.studio |
| Sanity project management | https://www.sanity.io/manage/project/dxinqb51 |
| Platform hosting | https://vercel.com/raazias-projects-142c0b42/nc4scm-platform |
| Conference hosting | https://vercel.com/raazias-projects-142c0b42/nc4scm-conference |

Additional client links and operating steps are in 02_Client_User_Manual.pdf. Current evidence is in 04_Verified_Checkpoint.json. No credentials or repository copies are included because Git and Sanity remain the source of truth.

### Change log

24 November 2026 - v1.0: reconciled current main branches, read the October handover, inspected live HTTP responses and public Sanity content, recorded the Vercel domain-inventory conflict, and created three focused handover documents. No operational migration was executed.

