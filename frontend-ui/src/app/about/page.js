import TeamDirectory from "@/app/components/TeamDirectory";
import { getSiteContent } from "@/lib/content";
import Image from "next/image";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import PartnerRail from "@/app/components/PartnerRail";

const QUERY = `{"page":*[_type=="aboutPage"][0],"team":*[_type=="teamMember" && hideFromDirectory != true]|order(displayPriority asc){_id,fullName,position,group,avatar,bio,cardSummary,researchInterests,qualification,portraitPlaceholder,email,secondaryEmail,linkedinUrl,githubUrl,profileUrl,orcidUrl,googleScholarUrl,researchGateUrl},"partners":*[_type=="partner"]|order(category asc,organizationName asc){_id,organizationName,category,logo,targetUrl}}`;
export async function generateMetadata() {
  const p = await client.fetch('*[_type=="aboutPage"][0]');
  return {
    title: p?.seo?.title || p?.headline,
    description: p?.seo?.description || p?.introduction,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [data, site] = await Promise.all([
    client.fetch(QUERY),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};
  const p = data.page || {};
  const partners = data.partners || [];
  const hero = urlFor(p.heroImage)
    ?.width(1600)
    .height(1100)
    .fit("crop")
    .auto("format")
    .url();
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner relative z-10 grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="eyebrow text-mint">{p.eyebrow}</p>
            <h1 className="page-hero-title mt-5">
              {p.headline}
            </h1>
          </div>
          <p className="max-w-xl border-l border-ivory/20 pl-5 text-base leading-7 text-ivory/80">
            {p.introduction}
          </p>
        </div>
      </section>
      <section className="section-shell bg-paper">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          {hero && (
            <div className="about-image relative overflow-hidden rounded-[1.25rem] border border-forest/10 shadow-float">
              <Image
                src={hero}
                alt={p.heroImage?.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div
            className={
              hero
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                : "grid gap-6 lg:col-span-2 lg:grid-cols-2"
            }
          >
            <Story
              label={text.mission}
              title={p.missionHeading}
              body={p.mission}
            />
            <Story
              label={text.vision}
              title={p.visionHeading}
              body={p.vision}
            />
          </div>
        </div>
      </section>
      <section className="journey-editorial section-shell overflow-hidden">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow text-clay">{text.journey}</p>
            <h2 className="section-title mt-4 text-carbon">
              {p.foundingHeading || text.journeyHeading}
            </h2>
          </div>
          <div className="max-w-xl text-base leading-8 text-carbon/60 lg:justify-self-end">
            <RichTextRenderer value={p.foundingStory} />
          </div>
        </div>
        <div className="journey-editorial-list relative z-10 mt-8">
          {(p.journey || []).map((item, index) => (
            <div
              key={item.year}
              className={`journey-editorial-row ${index % 2 ? "is-right" : "is-left"}`}
            >
              <article className="journey-editorial-card group">
                <span className="journey-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="journey-year">{item.year}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-carbon">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-carbon/58">
                  {item.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <p className="eyebrow text-clay">{text.people}</p>
        <div className="mt-4 grid gap-6 border-b border-forest/15 pb-6 lg:grid-cols-2">
          <h2 className="section-title">
            {p.teamHeading}
          </h2>
          <p className="self-end text-base leading-7 text-carbon/65">
            {p.teamIntroduction}
          </p>
        </div>
        <TeamDirectory members={data.team || []} text={text} />
      </section>
      <section className="section-shell overflow-hidden bg-[#0b282d] text-ivory">
        <div>
          <p className="eyebrow text-mint/65">{text.partners}</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <h2 className="section-title !text-ivory">{p.partnersHeading}</h2>
            <p className="self-end text-base leading-7 text-ivory/60">
              {p.partnersIntroduction}
            </p>
          </div>
        </div>
        <div className="mt-12 border-y border-mint/15 py-8">
          <PartnerRail partners={partners} />
        </div>
      </section>
    </>
  );
}

function Story({ label, title, body }) {
  return (
    <article className="mission-card group">
      <div>
        <p className="eyebrow text-mint">{label}</p>
      </div>
      <h2 className="mt-4 font-sans text-lg font-medium leading-relaxed tracking-tight text-forest">
        {title}
      </h2>
      {body?.length ? (
        <div className="mt-6 text-base leading-8 text-carbon/65">
          <RichTextRenderer value={body} />
        </div>
      ) : null}
    </article>
  );
}
