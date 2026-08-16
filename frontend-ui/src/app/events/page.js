import { client } from "@/sanityClient";
import EventsExplorer from "./EventsExplorer";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"events":*[_type=="event"]{_id,title,slug,eventType,eventDateTime,venue,description}}`;
export const metadata = {
  title: "Events — NC4SCM",
  description: "Conferences, seminars, and technical workshops from NC4SCM.",
};
export default async function EventsPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  return (
    <>
      <section className="bg-forest px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Knowledge exchange</p>
          <h1 className="mt-7 max-w-5xl font-display text-6xl leading-[.9] sm:text-8xl">
            {data.settings?.eventsHeadline ||
              "Where technical knowledge becomes shared capability."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {data.settings?.eventsIntroduction ||
              "Join conferences, seminars, and practical workshops designed for researchers, industry professionals, and public-sector decision makers."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <EventsExplorer events={data.events || []} />
      </section>
    </>
  );
}
