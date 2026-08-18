import { client } from "@/sanityClient";
import NewsGrid from "./NewsGrid";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"articles":*[_type=="news"]|order(publishedAt desc){_id,headline,slug,publishedAt,category,excerpt,coverImage}}`;
export const metadata = {
  title: "News — NC4SCM",
  description: "Announcements, milestones, and stories from NC4SCM.",
};
export default async function NewsPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  return (
    <>
      <section className="bg-forest px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">News & insight</p>
          <h1 className="mt-7 max-w-5xl font-display text-6xl leading-[.9] sm:text-8xl">
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
        <NewsGrid articles={data.articles || []} />
      </section>
    </>
  );
}
