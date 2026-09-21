import { client } from "@/sanityClient";
import NewsGrid from "./NewsGrid";
import { buildMetadata } from "@/lib/seo";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"articles":*[_type=="news"]|order(publishedAt desc){_id,headline,slug,publishedAt,category,excerpt,coverImage,externalUrl}}`;
export async function generateMetadata() {
  const settings = await client
    .fetch(`*[_type == "pageSettings"][0]{newsHeadline,newsIntroduction}`)
    .catch(() => null);
  return buildMetadata({
    title: "News, Research Milestones & Industry Updates",
    description:
      settings?.newsIntroduction ||
      "Announcements, research milestones, partnerships, and sustainable construction stories from NC4SCM.",
    path: "/news",
    keywords: ["NC4SCM news", "LC3 news", "construction research updates"],
  });
}
export default async function NewsPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const articles = data.articles || [];
  return (
    <>
      <section className="page-hero px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">News & insight</p>
          <h1 className="page-hero-title mt-7">
            {data.settings?.newsHeadline ||
              "Progress, partnerships, and practical impact."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {data.settings?.newsIntroduction ||
              "Follow the center’s latest research milestones, collaborations, public engagement, and industry activity."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <NewsGrid articles={articles} />
      </section>
    </>
  );
}
