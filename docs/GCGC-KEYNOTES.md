# GCGC 2027 dates and keynote profiles

The organizer approved 16–17 April 2027 and keynote speakers Dr. Fernando Martirena and Dr. Sofía Sánchez Berriel on 13 November 2026. No keynote title, time or venue beyond Karachi has been added.

Edit profiles in Studio: Events → Global Conference on Green Construction Materials and Practices 2027 → Keynote speaker profiles. Publish, then rebuild/redeploy `Raazia-Imran/nc4scm-conference`. That site's build reads the public published profiles with no write credential; a reviewed snapshot protects availability if Sanity cannot be reached. Dates remain release-controlled in the conference application/metadata, so date edits must also be released there.

Biographies and expertise were checked against https://lc3.ch/project-team/, https://www.lowcarbon.construction/ and https://sc.ibi.ethz.ch/en/publications.html. LinkedIn profile URLs are organizer-supplied; direct LinkedIn access was blocked. Sofia's identity is corroborated by her public LinkedIn keynote announcement at https://www.linkedin.com/posts/sofia-sanchez-8004663a_i-am-honoured-to-have-been-invited-to-deliver-activity-7388594495178829824-N-Qx. Avoid asserting academic rank because public source listings differ.

`cms-backend/seed/import-gcgc-keynotes.mjs` performs a one-time update using the existing protected GitHub workflow credential. It checks for drafts and changed dates/speakers, backs up both records, patches only conference fields using revision guards, and marks completion atomically. Later Studio edits are preserved. The corrected date banner replaces the obsolete dated poster on the event and announcement. Other deadlines and unrelated records are preserved.

Validation: CMS content tests, live dry-run and Studio production build. Check the workflow import result and public event API after merging before claiming the content was published. The conference site's CI and deployment are separate from this Studio workflow.
