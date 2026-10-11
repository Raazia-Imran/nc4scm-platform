import CompactText from "@/app/components/CompactText";
import { getSiteContent } from "@/lib/content";
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

export async function generateMetadata() {
  const p = await client.fetch('*[_type=="pageSettings"][0]');
  return {
    title: p?.researchHeadline,
    description: p?.researchIntroduction,
    alternates: { canonical: "/publications" },
  };
}

export default async function PublicationsPage() {
  const [publications, settings, site] = await Promise.all([
    client.fetch(PUBLICATIONS_QUERY),
    client
      .fetch(
        `*[_type == "pageSettings"][0]{researchHeadline,researchIntroduction}`,
      )
      .catch(() => null),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};

  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <p className="eyebrow text-mint">{text.researchLibrary}</p>
          <h1 className="page-hero-title mt-7">{settings?.researchHeadline}</h1>
          <CompactText className="page-hero-intro" value={settings?.researchIntroduction} label={text.readMore} />
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
