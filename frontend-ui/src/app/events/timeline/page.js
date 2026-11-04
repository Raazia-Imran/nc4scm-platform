import Link from "next/link";
import { client } from "@/sanityClient";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";
import { timelineGroups } from "@/lib/archive-content";
import EventGallery from "@/app/components/EventGallery";
import EventsNavigation from "@/app/components/EventsNavigation";
export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Journey in pictures | NC4SCM",
  description:
    "Explore the centre’s milestones, events and research moments through captioned photographs.",
  alternates: { canonical: "/events/timeline" },
});
export default async function TimelinePage({ searchParams }) {
  const params = await searchParams;
  const [data, site] = await Promise.all([
    client.fetch(
      `{"journey":*[_type=="aboutPage"][0].journey,"events":*[_type=="event"]{_type,title,slug,eventDateTime,coverImage,gallery},"news":*[_type=="news"]{_type,headline,slug,publishedAt,coverImage,gallery}}`,
    ),
    getSiteContent(),
  ]);
  const groups = timelineGroups(
    data.journey || [],
    data.events || [],
    data.news || [],
  );
  const selected = groups.find((x) => x.year === params?.year) || groups[0];
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <p className="eyebrow text-mint">The NC4SCM archive</p>
          <h1 className="page-hero-title mt-5">
            A journey.
            <br />
            <span className="archive-serif">Many moments.</span>
          </h1>
          <p className="page-hero-intro">
            The people, discoveries and gatherings that shaped the centre, one
            year at a time.
          </p>
        </div>
      </section>
      <section className="section-shell archive-surface">
        <EventsNavigation timeline />
        <div className="timeline-browser">
          <aside className="timeline-year-rail">
            <p className="eyebrow text-clay">Choose a chapter</p>
            <nav aria-label="Timeline years">
              {groups.map((group) => (
                <Link
                  key={group.year}
                  href={`/events/timeline?year=${encodeURIComponent(group.year)}`}
                  scroll={false}
                  aria-current={
                    group.year === selected?.year ? "page" : undefined
                  }
                >
                  <span>{group.year}</span>
                  <small>
                    {group.photos.length
                      ? `${group.photos.length} photographs`
                      : "Milestone"}
                  </small>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            <Link className="text-link mt-6" href="/about#journey">
              Back to our story ↗
            </Link>
          </aside>
          {selected ? (
            <article className="timeline-chapter">
              <div className="archive-chapter-heading">
                <span className="archive-large-year" aria-hidden="true">
                  {selected.year}
                </span>
                <div>
                  <p className="eyebrow text-clay">
                    From the archive · {selected.year}
                  </p>
                  <h2>{selected.title}</h2>
                  <p>{selected.description}</p>
                </div>
              </div>
              {selected.photos.length ? (
                <EventGallery
                  key={selected.year}
                  images={selected.photos}
                  text={site.interfaceText}
                  label={`${selected.year} photographs`}
                />
              ) : (
                <div className="archive-empty">
                  <span className="archive-empty-mark" aria-hidden="true">
                    ↗
                  </span>
                  <h3>A chapter waiting to be seen.</h3>
                  <p>
                    The milestone is part of our story. Photographs will appear
                    here when the centre publishes them.
                  </p>
                </div>
              )}
              {selected.links.length > 0 && (
                <div className="archive-related">
                  <p className="eyebrow text-clay">Read the stories</p>
                  {selected.links.map((link, i) => (
                    <Link href={link.href} key={link.href + i}>
                      {link.title}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ) : (
            <div className="archive-empty">
              <h2>The archive is taking shape.</h2>
              <p>
                Published timeline milestones and event photographs will appear
                here.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
