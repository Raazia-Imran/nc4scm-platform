import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";
import JsonLd from "@/app/components/JsonLd";
import {
  buildMetadata,
  ORGANIZATION_NAME,
  SITE_URL,
  sanityImageUrl,
} from "@/lib/seo";

const QUERY = `*[_type=="event"&&slug.current==$slug][0]{_updatedAt,title,slug,eventType,eventDateTime,venue,description,pastEventRecap,speakers,registrationUrl,coverImage,gallery}`;

export async function generateMetadata({ params }) {
  const event = await client
    .fetch(QUERY, { slug: params.slug })
    .catch(() => null);
  if (!event) {
    return buildMetadata({
      title: "Event Not Found",
      path: `/events/${params.slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: event.title,
    description: event.description,
    path: `/events/${event.slug.current}`,
    image: event.coverImage,
    imageAlt: event.coverImage?.alt || event.title,
    keywords: [event.eventType, "NC4SCM event", "sustainable construction event"].filter(Boolean),
  });
}

export default async function EventDetail({ params }) {
  const event = await client
    .fetch(QUERY, { slug: params.slug })
    .catch(() => null);
  if (!event) notFound();
  const cover = urlFor(event.coverImage)
    ?.width(1800)
    .height(1000)
    .fit("crop")
    .auto("format")
    .url();
  const date = new Date(event.eventDateTime);
  const isPast = date.getTime() < Date.now();
  const canonical = `${SITE_URL}/events/${event.slug.current}`;
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${canonical}/#event`,
    name: event.title,
    description: event.description,
    url: canonical,
    startDate: event.eventDateTime,
    eventStatus: isPast
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: sanityImageUrl(event.coverImage),
    location: {
      "@type": "Place",
      name: event.venue,
      address: event.venue,
    },
    organizer: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
    },
    sameAs: event.registrationUrl,
  };
  return (
    <>
      <JsonLd data={eventJsonLd} />
      <section className="bg-forest px-6 pb-20 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/events" className="eyebrow text-mint">
            ← All events
          </Link>
          <p className="eyebrow mt-10 text-mint">{event.eventType}</p>
          <h1 className="mt-5 max-w-5xl font-display text-5xl leading-[.95] sm:text-7xl">
            {event.title}
          </h1>
          <div className="mt-10 grid gap-4 border-t border-ivory/20 pt-6 sm:grid-cols-2">
            <p>
              {date.toLocaleDateString("en-US", { dateStyle: "long" })} ·{" "}
              {date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p>{event.venue}</p>
          </div>
        </div>
      </section>
      {cover && (
        <div className="relative mx-auto aspect-[16/8] max-w-[1400px]">
          <Image
            src={cover}
            alt={event.coverImage?.alt || event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <section className="section-shell bg-ivory">
        <div className="grid gap-14 lg:grid-cols-[1fr_.4fr]">
          <p className="max-w-3xl text-xl leading-9 text-carbon/70">
            {event.description}
          </p>
          <aside>
            {event.speakers?.length > 0 && (
              <>
                <p className="eyebrow text-clay">Speakers</p>
                <ul className="mt-5 space-y-3">
                  {event.speakers.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </>
            )}
            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-dark mt-8"
              >
                Register or learn more <span>↗</span>
              </a>
            )}
          </aside>
        </div>
        {isPast && (event.pastEventRecap || event.gallery?.length > 0) && (
          <div className="mt-20 border-t border-forest/15 pt-12 sm:mt-24 sm:pt-16">
            <div className="grid gap-7 lg:grid-cols-[.45fr_1fr] lg:gap-16">
              <div>
                <p className="eyebrow text-clay">Event highlights</p>
                <h2 className="mt-4 font-sans text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[.98] tracking-[-.045em] text-forest">
                  A look back at the event.
                </h2>
              </div>
              {event.pastEventRecap && (
                <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-carbon/70 sm:text-lg">
                  {event.pastEventRecap}
                </p>
              )}
            </div>
            {event.gallery?.length > 0 && (
              <div className="event-gallery mt-10 sm:mt-14">
                {event.gallery.map((item, index) => {
                  const galleryImage = urlFor(item)
                    ?.width(1400)
                    .height(index % 3 === 0 ? 1050 : 900)
                    .fit("crop")
                    .auto("format")
                    .url();
                  if (!galleryImage) return null;
                  return (
                    <figure className="event-gallery-item" key={item._key || index}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage sm:rounded-[1.75rem]">
                        <Image
                          src={galleryImage}
                          alt={
                            item.alt ||
                            `${event.title} event photograph ${index + 1}`
                          }
                          fill
                          sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 31vw"
                          className="object-cover transition duration-500 hover:scale-[1.025]"
                        />
                      </div>
                      {item.caption && (
                        <figcaption className="mt-3 text-sm leading-6 text-carbon/55">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
