import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";

const QUERY = `*[_type=="event"&&slug.current==$slug][0]{title,eventType,eventDateTime,venue,description,speakers,registrationUrl,coverImage,gallery}`;

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
  return (
    <>
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
            alt={event.coverImage?.alt || ""}
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
      </section>
    </>
  );
}
