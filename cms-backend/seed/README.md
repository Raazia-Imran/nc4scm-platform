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
