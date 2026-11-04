# Journey photographs and Centre Archive

## What visitors see

- The About timeline keeps its existing layout. Each milestone opens `/events/timeline?year=…` at that chapter.
- Events has two linked views: **Events & gatherings** and **Journey in pictures**.
- Year chapters show captioned milestone photographs plus already-published event/news photographs from that calendar year. Older years without photographs have an honest empty state.
- Galleries support touch swipes, mouse dragging, left/right keyboard keys, thumbnails, previous/next buttons and fullscreen viewing. Escape closes fullscreen and returns focus to its opener.
- **Centre Archive** (`/legacy`) recognises past team members, student/research projects and practical contributors using different layouts.
- Approved projects have individual pages at `/legacy/projects/<slug>` with team, supervisors, outcomes, full story and photographs.

The editorial presentation draws inspiration from Framer’s Elena Vasari and Novum Gallery references. The implementation is native to the existing Next.js/Sanity site and keeps the established colour palette and public content. No template source or invented research/project data is imported.

## Add year photographs

Open **About Page → Journey Timeline**, expand a milestone and add **Milestone photographs**. Every new photograph requires alternative text and a caption; an optional photographer credit is available. Publish the About document. The timeline chapter updates with the ordinary CMS cache refresh.

You do not need to add photographs to About’s visible cards. The cards lead to the dedicated Events photo chapter instead. Existing approved event/news photographs are grouped by their actual published event/news dates; the system does not invent photographs for years without supplied material.

## Finish a contract

Open the existing **Team Member** profile. Either:

1. Set **Contract end date** to the final active day; or
2. Set **Contract status → Contract ended** for an immediate change.

Publish the same profile. The site reads the same document for both directories. A past member stops appearing among current team profiles and appears in Centre Archive with their complete existing biography, links, qualification and interests. Contribution summary and highlights can be added to explain their work. Nothing is deleted or copied to another CMS document.

An end date includes the entire stated day in **Asia/Karachi**. Automatic classification occurs after that day ends. No scheduled content-writing job or manual profile transfer is required. Pages use the existing minute-based regeneration, and open directories recheck the passage of time every minute. Newly published CMS changes can take a short time to pass through the API/page caches; refresh after publishing.

Existing profiles without contract fields remain current. A future end date does not remove someone early. **Hide from public team directory** remains an explicit override for both public directories and is applied in server queries as well as client filtering. It is not the contract-ended control.

## Lasting website credit

Use **Keep lasting credit on the main team page** for someone whose contribution should stay visible after service ends. That person appears in Centre Archive and also keeps a card on About labelled **Lasting contribution**, rather than being represented as a current employee.

Raazia Imran Reshamwala’s existing CMS document ID `team-razia` (with her established slug `raazia-imran-reshamwala` as a fallback) receives this lasting-credit treatment automatically, as requested. This does not fabricate or copy a second profile. If the profile is recreated as a new document with a different ID and slug, explicitly enable the lasting-credit field. An explicit public-directory hide still takes precedence.

## Add older projects

In **Legacy projects**, create a record and supply:

- Title, URL slug, category and completion year.
- Short summary and optional full project story.
- Student/project-team names, institution and supervisor references or names.
- Outcomes, captioned cover/gallery photographs and an optional HTTPS project/publication link.
- **Approved for public display** switched on when permission and information have been checked.

Publish the document. Only approved published records appear on the listing, detail routes and sitemap. Projects and former staff are separate content types/views; staff profiles do not have to be rebuilt as projects.

## Recognise practical contributions

In **Practical contributions**, create an individual or team entry. Enter the public name, trade/role, contribution summary, contribution period and skills. Optional fields include an approved work photograph/portrait, longer story, captioned gallery and links to related approved projects. Enable **Approved for public display** and publish.

These fields are designed for technicians, craftspeople, workers and practical teams. Do not enter private identity numbers, payroll details or home addresses. The display toggle controls website presentation; it does not turn a public Sanity dataset into private storage.

## Edit the new page

**Centre Archive page** in the Studio sidebar controls its title, introduction, hero photograph and section headings/descriptions. Before it has been saved, built-in English interface text keeps the page usable, and its hero can reuse the already-published About photograph. No existing singleton or content is overwritten.

The main navigation adds Centre Archive if the CMS navigation does not already include that URL; an existing CMS navigation item is preserved. About and Events also link directly to the new features.

## Release and verification

Implementation is on `feat/journey-living-legacy`, based on main `7964546`. The separate Studio dependency-upgrade PR #23 is not bundled into this feature change.

Tests cover the Pakistan-time contract boundary, ended/future/legacy profiles, lasting credit, hide precedence, unchanged biography data, timeline deep links, mouse/touch/keyboard photo browsing, fullscreen focus return, approval gating, project supervision/outcomes, real 404s for unapproved projects and sitemap inclusion. The existing content tests and responsive website suite also run. Check the associated PR’s latest results for exact local/CI/deployment completion.

The global streaming loading skeleton is removed and metadata is resolved before streaming. This allows missing or unapproved project URLs to return HTTP 404 before response headers are sent. The rendered page layouts and content are preserved.

No fixture names, sample projects, fake work photographs or synthetic contribution records are published. The centre must add its actual year photographs, former-member contract information, student projects and practical contributor records through the new CMS fields.

## Rollback

Revert the feature merge through a new reviewed Git commit and let the normal website/Studio deployment workflows rebuild. Do not rewrite published history. Existing content fields and records are retained; any new legacy records can stay in Sanity while the older site runs. No destructive content migration, DNS or authentication change is part of this update.

Design references:
- https://www.framer.com/marketplace/templates/elena-vasari/
- https://www.framer.com/marketplace/templates/novum-gallery/
