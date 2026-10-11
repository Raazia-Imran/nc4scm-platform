import CompactText from "@/app/components/CompactText";
import EventGallery from "@/app/components/EventGallery";
import { getSiteContent } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";

const QUERY = `*[_type=="event"&&slug.current==$slug][0]{title,eventType,eventDateTime,endDateTime,venue,description,pastEventRecap,keyOutcomes,speakers,registrationUrl,coverImage,gallery}`;

export async function generateMetadata({ params }) {
  const event = await client.fetch(QUERY, { slug: params.slug });
  return {
    title: event?.title,
    description: event?.description,
    alternates: { canonical: `/events/${params.slug}` },
  };
}
export default async function EventDetail({ params }) {
  const [event, site] = await Promise.all([
    client.fetch(QUERY, { slug: params.slug }),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};
  if (!event) notFound();
  const cover = urlFor(event.coverImage)
    ?.width(1200)
    .auto("format")
    .url();
  const date = new Date(event.eventDateTime);
  const isPast =
    new Date(event.endDateTime || event.eventDateTime).getTime() < Date.now();
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <Link href="/events" className="eyebrow text-mint">
            ← {text.allEvents}
          </Link>
          <p className="eyebrow mt-5 text-mint">{event.eventType}</p>
          <h1 className="page-hero-title mt-4">
            {event.title}
          </h1>
          <div className="mt-5 grid gap-3 border-t border-ivory/20 pt-4 text-sm sm:grid-cols-2">
            <p>
              {date.toLocaleDateString("en-US", {
                dateStyle: "long",
                timeZone: "Asia/Karachi",
              })}{" "}
              ·{" "}
              {date.toLocaleTimeString("en-US", {
                timeZone: "Asia/Karachi",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p>{event.venue}</p>
          </div>
        </div>
      </section>
      {cover && (
        <div className="event-detail-cover">
          <Image
            src={cover}
            alt={event.coverImage?.alt || event.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain bg-sage"
          />
        </div>
      )}
      <section className="section-shell bg-ivory">
        <div className="event-detail-copy">
          <CompactText value={event.description} label={text.readMore} />
          <aside>
            {event.speakers?.length > 0 && (
              <>
                <p className="eyebrow text-clay">{text.speakers}</p>
                <ul className="mt-5 space-y-3">
                  {event.speakers.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </>
            )}
            {!isPast && event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-dark mt-8"
              >
                {text.register} <span>↗</span>
              </a>
            )}
          </aside>
        </div>
        {isPast && (event.pastEventRecap || event.gallery?.length > 0 || event.keyOutcomes?.length > 0) && (
          <div className="event-recap">
            <div className="grid gap-5 lg:grid-cols-[.4fr_1fr] lg:gap-8">
              <div>
                <p className="eyebrow text-clay">{text.eventHighlights}</p>
                <h2 className="section-title mt-3">
                  {text.eventRecap}
                </h2>
              </div>
              {event.pastEventRecap && (
                <CompactText className="max-w-3xl text-base leading-7 text-carbon/70" value={event.pastEventRecap} label={text.readMore} />
              )}
            </div>
            {event.keyOutcomes?.length > 0 && (
              <div className="mt-5"><h3 className="eyebrow text-clay">{text.eventOutcomes}</h3><ul className="event-outcomes">{event.keyOutcomes.filter((item) => typeof item === "string" && item.trim()).map((item, index) => <li key={index}>{item}</li>)}</ul></div>
            )}
            <EventGallery images={(event.gallery || []).flatMap((item, index) => {
              const src = urlFor(item)?.width(1400).auto("format").url();
              return src ? [{src, alt: item.alt || event.title, caption: item.caption || "", key: item._key || String(index)}] : [];
            })} text={text} />
          </div>
        )}
      </section>
    </>
  );
}
