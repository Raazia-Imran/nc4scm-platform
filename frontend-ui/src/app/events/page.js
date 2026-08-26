import { client } from "@/sanityClient";
import EventsExplorer from "./EventsExplorer";
import { verifiedEvents } from "@/content/clientContent";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"events":*[_type=="event"]{_id,title,slug,eventType,eventDateTime,venue,description,registrationUrl,coverImage}}`;
export const metadata = {
  title: "Events — NC4SCM",
  description: "Conferences, seminars, and technical workshops from NC4SCM.",
};
export default async function EventsPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const cmsEvents = (data.events || []).map((item) => ({
    ...item,
    externalUrl: item.registrationUrl,
  }));
  const fallbackIds = new Set(verifiedEvents.map((item) => item._id));
  const events = [
    ...verifiedEvents.map((fallback) => ({
      ...fallback,
      ...(cmsEvents.find((item) => item._id === fallback._id) || {}),
    })),
    ...cmsEvents.filter((item) => !fallbackIds.has(item._id)),
  ];
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
