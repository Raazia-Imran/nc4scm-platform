import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/sanityClient";
import TestimonialShowcase from "@/app/components/TestimonialShowcase";
import RichTextRenderer from "@/app/components/RichTextRenderer";

const QUERY = `{"page":*[_type=="homePage"][0],"services":*[_type=="service"]|order(displayOrder asc)[0...4]{_id,title,slug,summary},"partners":*[_type=="partner"]|order(organizationName asc)[0...8]{_id,organizationName,logo,targetUrl},"testimonials":*[_type=="testimonial"&&published!=false]|order(displayOrder asc){_id,quote,personName,role,organization,portrait},"news":*[_type=="news"]|order(publishedAt desc)[0...6]{_id,headline,slug,publishedAt,category,excerpt,coverImage,externalUrl},"events":*[_type=="event"&&eventDateTime>=now()]|order(eventDateTime asc)[0...4]{_id,title,slug,eventDateTime,venue,registrationUrl}}`;

const Action = ({ link, light = false }) =>
  link?.href ? (
    <Link
      href={link.href}
      className={`button ${light ? "button-light" : "button-dark"}`}
    >
      {link.label}
      <span aria-hidden="true">↗</span>
    </Link>
  ) : null;

export default async function HomePage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const page = data.page || {};
  const hero = urlFor(page.heroImage)
    ?.width(1800)
    .height(1300)
    .fit("crop")
    .auto("format")
    .url();
  const flagship = urlFor(page.flagshipImage)
    ?.width(1200)
    .height(900)
    .fit("crop")
    .auto("format")
    .url();
  const services = data.services || [];
  const news = data.news || [];
  const events = (data.events || []).map((item) => ({
    ...item,
    externalUrl: item.registrationUrl,
  }));
  const stats = page.statistics || [];
  return (
    <>
      <section className="relative min-h-[850px] overflow-hidden bg-forest pt-36 text-ivory lg:min-h-screen">
        {hero && (
          <Image
            src={hero}
            alt={page.heroImage?.alt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,51,38,.97)_0%,rgba(12,51,38,.76)_52%,rgba(12,51,38,.25)_100%)]" />
        <div className="material-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto flex min-h-[710px] max-w-[1400px] flex-col justify-end px-6 pb-20 sm:px-10 lg:pb-24">
          <p className="eyebrow text-mint">{page.eyebrow}</p>
          <h1 className="mt-6 max-w-5xl font-sans text-[clamp(3.3rem,7.5vw,7.6rem)] font-medium leading-[.88] tracking-[-.065em]">
            {page.headline}
          </h1>
          <div className="mt-10 grid gap-8 border-t border-ivory/25 pt-7 lg:grid-cols-[1fr_.75fr] lg:items-end">
            <p className="max-w-2xl text-base leading-7 text-ivory/75 sm:text-lg">
              {page.intro}
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Action link={page.primaryCta} light />
              <Link
                href={page.secondaryCta?.href}
                className="button button-ghost"
              >
                {page.secondaryCta?.label}
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <p className="eyebrow text-clay">{page.aboutKicker}</p>
          <div>
            <h2 className="section-title max-w-4xl">{page.aboutHeading}</h2>
            {page.aboutBody?.length ? <div className="mt-8 max-w-2xl text-lg leading-8 text-carbon/65"><RichTextRenderer value={page.aboutBody} /></div> : null}
            <Link href="/about" className="text-link mt-9 inline-flex">
              Discover the center <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="premium-card stat-card p-7"
            >
              <p className="font-display text-5xl text-forest">{s.value}</p>
              <p className="mt-3 max-w-[13rem] text-sm leading-6 text-carbon/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-shell bg-limestone">
        <div className="flex flex-col gap-7 border-b border-forest/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-clay">Capabilities</p>
            <h2 className="section-title mt-5 max-w-3xl">
              {page.servicesHeading}
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-carbon/65">
            {page.servicesIntro}
          </p>
        </div>
        <div className="grid lg:grid-cols-2">
          {services.map((s, i) => (
            <Link
              key={s._id || s.title}
              href={
                s.slug?.current ? `/services/${s.slug.current}` : "/services"
              }
              className="service-row group"
            >
              <span className="text-xs text-clay">0{i + 1}</span>
              <div>
                <h3 className="font-display text-3xl text-forest sm:text-4xl">
                  {s.title}
                </h3>
                {s.summary && (
                  <p className="mt-3 max-w-xl text-sm leading-6 text-carbon/60">
                    {s.summary}
                  </p>
                )}
              </div>
              <span className="service-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section-shell bg-[#0b282d] text-ivory">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-carbon/15">
            {flagship ? (
              <Image
                src={flagship}
                alt={page.flagshipImage?.alt || ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="material-sample h-full w-full" />
            )}
          </div>
          <div>
            <p className="eyebrow text-ivory/70">{page.flagshipLabel}</p>
            <h2 className="mt-6 font-display text-5xl leading-[.98] sm:text-6xl">
              {page.flagshipTitle}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-ivory/75">
              {page.flagshipSummary}
            </p>
            {page.flagshipLink && (
              <div className="mt-9">
                <Action link={page.flagshipLink} light />
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="flex items-end justify-between border-b border-forest/15 pb-6">
              <h2 className="font-display text-5xl text-forest">
                News & insight
              </h2>
              <Link className="text-link" href="/news">
                All news <span>↗</span>
              </Link>
            </div>
            {news.length ? (
              news.map((n) => (
                <Link
                  key={n._id}
                  href={
                    n.externalUrl ||
                    (n.slug?.current ? `/news/${n.slug.current}` : "/news")
                  }
                  target={n.externalUrl ? "_blank" : undefined}
                  rel={n.externalUrl ? "noreferrer" : undefined}
                className="premium-card group mt-4 grid gap-5 p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:pr-6"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sage">
                    {n.coverImage && (
                      <Image
                        src={
                          urlFor(n.coverImage)?.width(320).height(240).url()
                        }
                        alt={n.coverImage?.alt || n.headline}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[.16em] text-clay">
                      {n.category || "Update"}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-forest">
                      {n.headline}
                    </h3>
                  </div>
                  <span>↗</span>
                </Link>
              ))
            ) : (
              <p className="py-8 text-carbon/55">
                Published updates will appear here.
              </p>
            )}
          </div>
          <aside className="rounded-[2rem] bg-forest p-8 text-ivory">
            <p className="eyebrow text-mint">On the calendar</p>
            <h2 className="mt-5 font-display text-4xl">Upcoming events</h2>
            <div className="mt-8 divide-y divide-ivory/15">
              {events.length ? (
                events.map((e) => (
                  <Link
                    key={e._id}
                    href={
                      e.externalUrl ||
                      (e.slug?.current
                        ? `/events/${e.slug.current}`
                        : "/events")
                    }
                    target={e.externalUrl ? "_blank" : undefined}
                    rel={e.externalUrl ? "noreferrer" : undefined}
                    className="grid grid-cols-[4rem_1fr] gap-5 py-6"
                  >
                    <div>
                      <p className="font-display text-3xl">
                        {new Date(e.eventDateTime).getDate()}
                      </p>
                      <p className="text-xs uppercase text-mint">
                        {new Date(e.eventDateTime).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-display text-xl">{e.title}</h3>
                      <p className="mt-2 text-xs text-ivory/55">{e.venue}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-6 text-sm text-ivory/60">
                  New events will be announced here.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
      <TestimonialShowcase testimonials={data.testimonials || []} />
      <section className="marble-surface px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-clay">Work with NC4SCM</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <h2 className="font-display text-5xl leading-[.96] text-forest sm:text-7xl">
              {page.closingHeading}
            </h2>
            <div>
              <p className="text-base leading-7 text-carbon/65">
                {page.closingBody}
              </p>
              <div className="mt-7">
                <Action link={page.closingLink} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
