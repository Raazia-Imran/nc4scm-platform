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

// Publication author names are stored in official citation order. Optional
// team-member references are fetched separately so external collaborators do
// not require artificial Team Member records.
const PUBLICATIONS_QUERY = `*[_type == "publication"] | order(publicationYear desc, releaseDate desc){
  _id,
  _createdAt,
  title,
  publicationType,
  publicationYear,
  releaseDate,
  category,
  journal,
  publisher,
  doiUrl,
  keywords,
  abstract,
  authors,
  "teamAuthors": teamAuthors[]->{_id, fullName},
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
      <section className="page-hero px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Research library</p>
          <h1 className="page-hero-title mt-7">
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
