import CompactText from "@/app/components/CompactText";
import { getSiteContent } from "@/lib/content";
import { client } from "@/sanityClient";
import EventsExplorer from "./EventsExplorer";
const QUERY = `{"settings":*[_type=="pageSettings"][0],"events":*[_type=="event"]{_id,title,slug,eventType,eventDateTime,endDateTime,venue,description,registrationUrl,coverImage}}`;
export async function generateMetadata() {
  const p = await client.fetch('*[_type=="pageSettings"][0]');
  return {
    title: p?.eventsHeadline,
    description: p?.eventsIntroduction,
    alternates: { canonical: "/events" },
  };
}
export default async function EventsPage() {
  const [data, site] = await Promise.all([
    client.fetch(QUERY),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};
  const events = (data.events || []).map((item) => ({
    ...item,
    externalUrl: item.registrationUrl,
  }));
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <p className="eyebrow text-mint">{text.knowledgeExchange}</p>
          <h1 className="page-hero-title mt-7">
            {data.settings?.eventsHeadline}
          </h1>
          <CompactText className="page-hero-intro" value={data.settings?.eventsIntroduction} label={text.readMore} />
        </div>
      </section>
      <section className="section-shell marble-surface">
        <EventsExplorer events={events} now={Date.now()} />
      </section>
    </>
  );
}
