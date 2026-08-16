// src/app/publications/page.js
// -----------------------------------------------------------------------------
// The Research Hub's Technical Publications Vault. This page itself stays a
// Server Component so the initial (and typically large) list of
// publications is fetched once on the server and streamed down as HTML —
// no client-side loading spinner for the first paint. The interactive
// search/filter behavior, which genuinely needs client-side state, is
// isolated into the separate <PublicationsVault> Client Component below.
// -----------------------------------------------------------------------------
import { client } from "@/sanityClient";
import PublicationsVault from "./PublicationsVault";

// We dereference the `authors` references directly in the GROQ query using
// the `->` operator, so the frontend receives fully-resolved author names
// instead of having to make a second round-trip per publication.
const PUBLICATIONS_QUERY = `*[_type == "publication"] | order(releaseDate desc){
  _id,
  title,
  releaseDate,
  category,
  journal,
  doiUrl,
  keywords,
  abstract,
  "authors": authors[]->{_id, fullName},
  "pdfUrl": pdfFile.asset->url,
  "pdfFilename": pdfFile.asset->originalFilename
}`;

export const metadata = {
  title: "Publications — NC4SCM",
};

export default async function PublicationsPage() {
  const [publications, settings] = await Promise.all([
    client.fetch(PUBLICATIONS_QUERY),
    client
      .fetch(
        `*[_type == "pageSettings"][0]{researchHeadline,researchIntroduction}`,
      )
      .catch(() => null),
  ]);

  return (
    <>
      <section className="bg-forest px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Research library</p>
          <h1 className="mt-7 max-w-5xl font-display text-6xl leading-[.9] sm:text-8xl">
            {settings?.researchHeadline ||
              "Evidence designed to travel beyond the laboratory."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {settings?.researchIntroduction ||
              "Search peer-reviewed publications, conference work, and technical reports by topic, author, or year."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        {/* publications defaults to an empty array so the client component
          never has to null-check its own prop. */}
        <PublicationsVault publications={publications || []} />
      </section>
    </>
  );
}
