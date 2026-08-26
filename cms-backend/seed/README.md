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

## Client-provided news and events

`client-content.ndjson` contains the seven verified news records and three
event records prepared from the client-provided LinkedIn sources and seminar
poster. It uses stable IDs and does not overwrite the singleton page settings.

```bash
npx sanity dataset import seed/client-content.ndjson production --replace
```

The supplied media is kept in the frontend as a resilient local fallback.
Editors can later upload replacement cover images in Sanity without changing
the verified titles, dates, descriptions, or source links.
