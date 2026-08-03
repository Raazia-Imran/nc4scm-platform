// src/app/publications/page.js
// -----------------------------------------------------------------------------
// The Research Hub's Technical Publications Vault. This page itself stays a
// Server Component so the initial (and typically large) list of
// publications is fetched once on the server and streamed down as HTML —
// no client-side loading spinner for the first paint. The interactive
// search/filter behavior, which genuinely needs client-side state, is
// isolated into the separate <PublicationsVault> Client Component below.
// -----------------------------------------------------------------------------
import {client} from '@/sanityClient'
import PublicationsVault from './PublicationsVault'

// We dereference the `authors` references directly in the GROQ query using
// the `->` operator, so the frontend receives fully-resolved author names
// instead of having to make a second round-trip per publication.
const PUBLICATIONS_QUERY = `*[_type == "publication"] | order(releaseDate desc){
  _id,
  title,
  releaseDate,
  category,
  abstract,
  "authors": authors[]->{_id, fullName},
  "pdfUrl": pdfFile.asset->url,
  "pdfFilename": pdfFile.asset->originalFilename
}`

export const metadata = {
  title: 'Publications — NC4SCM',
}

export default async function PublicationsPage() {
  const publications = await client.fetch(PUBLICATIONS_QUERY)

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10">
      <h1 className="font-display text-4xl leading-tight text-ink">Technical Publications Vault</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
        Peer-reviewed papers, technical reports, and abstracts produced by
        NC4SCM researchers. Search by title or filter by category.
      </p>

      {/* publications defaults to an empty array so the client component
          never has to null-check its own prop. */}
      <PublicationsVault publications={publications || []} />
    </section>
  )
}
