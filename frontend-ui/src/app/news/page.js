import { client } from "@/sanityClient";
import NewsGrid from "./NewsGrid";
import { verifiedNews } from "@/content/clientContent";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"articles":*[_type=="news"]|order(publishedAt desc){_id,headline,slug,publishedAt,category,excerpt,coverImage,externalUrl}}`;
export const metadata = {
  title: "News — NC4SCM",
  description: "Announcements, milestones, and stories from NC4SCM.",
};
export default async function NewsPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const cmsArticles = data.articles || [];
  const fallbackIds = new Set(verifiedNews.map((item) => item._id));
  const articles = [
    ...verifiedNews.map((fallback) => ({
      ...fallback,
      ...(cmsArticles.find((item) => item._id === fallback._id) || {}),
    })),
    ...cmsArticles.filter((item) => !fallbackIds.has(item._id)),
  ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
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
