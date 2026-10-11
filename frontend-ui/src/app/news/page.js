import { getSiteContent } from "@/lib/content";
import { client } from "@/sanityClient";
import NewsGrid from "./NewsGrid";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"articles":*[_type=="news"]|order(publishedAt desc){_id,headline,slug,publishedAt,category,excerpt,coverImage,externalUrl}}`;
export async function generateMetadata() {
  const p = await client.fetch('*[_type=="pageSettings"][0]');
  return {
    title: p?.newsHeadline,
    description: p?.newsIntroduction,
    alternates: { canonical: "/news" },
  };
}
export default async function NewsPage() {
  const [data, site] = await Promise.all([
    client.fetch(QUERY),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};
  const articles = data.articles || [];
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <p className="eyebrow text-mint">{text.newsInsight}</p>
          <h1 className="page-hero-title mt-7">
            {data.settings?.newsHeadline}
          </h1>
          <p className="page-hero-intro">{data.settings?.newsIntroduction}</p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <NewsGrid articles={articles} />
      </section>
    </>
  );
}
