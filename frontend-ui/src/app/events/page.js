import { client } from "@/sanityClient";
import EventsExplorer from "./EventsExplorer";
import { buildMetadata } from "@/lib/seo";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"events":*[_type=="event"]{_id,title,slug,eventType,eventDateTime,venue,description,registrationUrl,coverImage}}`;
export async function generateMetadata() {
  const settings = await client
    .fetch(`*[_type == "pageSettings"][0]{eventsHeadline,eventsIntroduction}`)
    .catch(() => null);
  return buildMetadata({
    title: "Conferences, Seminars & Technical Workshops",
    description:
      settings?.eventsIntroduction ||
      "Explore NC4SCM conferences, seminars, and workshops on low-carbon and sustainable construction materials.",
    path: "/events",
    keywords: ["sustainable construction events", "LC3 conference", "materials engineering workshops"],
  });
}
export default async function EventsPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const events = (data.events || []).map((item) => ({
    ...item,
    externalUrl: item.registrationUrl,
  }));
  return (
    <>
      <section className="page-hero px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Knowledge exchange</p>
          <h1 className="page-hero-title mt-7">
            {data.settings?.eventsHeadline ||
              "Where technical knowledge becomes shared capability."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {data.settings?.eventsIntroduction ||
              "Join conferences, seminars, and practical workshops designed for researchers, industry professionals, and public-sector decision makers."}
          </p>
        </div>
      </section>
      <section className="section-shell marble-surface">
        <EventsExplorer events={events} />
      </section>
    </>
  );
}
