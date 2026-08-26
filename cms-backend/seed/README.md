# Publication seed data

`publications.ndjson` contains the 12 publication citations supplied by the
client in `Publications.docx`. Titles, author order, venues, publishers, years,
and DOI identifiers were cross-checked against publisher or bibliographic
records before import.

The file intentionally omits abstracts, exact dates, keywords, and PDF assets
when the client source did not supply them. Those fields should be completed
only from client-approved or appropriately licensed material.

## Import

Deploy the updated Studio schema first, then run this command from
`cms-backend` while authenticated to the correct Sanity project:

```bash
npx sanity dataset import seed/publications.ndjson production --replace
```

The records use stable DOI-derived `_id` values. Re-running the command with
`--replace` updates these 12 records instead of creating duplicates.

## Client-managed website content

`client-content.ndjson` contains the client-approved global settings, page
copy, journey, seven news records, three events, four services, three partners,
and the two currently approved team profiles. The preparation script attaches
the supplied center logo, partner logos, and news/event media as Sanity assets.
Team portraits remain empty until approved images are uploaded in Studio.
Stable IDs make the import safe to repeat without creating duplicates.

```bash
npm run seed:client
```

Run this from `cms-backend`. It creates a machine-specific generated NDJSON
file with absolute asset paths, then imports the documents and media into the
`production` dataset. Afterwards, supplied copy, contacts, social links,
timeline entries, team records, partner and center logos, news, events, and
services are editable in Studio. The generated file is ignored by Git.
