import Image from "next/image";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import PartnerRail from "@/app/components/PartnerRail";
import Reveal from "@/app/components/Reveal";
import {
  centreContent,
  immediatePartners,
  journey,
} from "@/content/clientContent";

const QUERY = `{"page":*[_type=="aboutPage"][0],"team":*[_type=="teamMember"]|order(displayPriority asc){_id,fullName,position,group,avatar,bio,email,linkedinUrl},"partners":*[_type=="partner"]|order(category asc,organizationName asc){_id,organizationName,category,logo,targetUrl}}`;
const groups = {
  "principal-investigator": "Principal Investigator",
  "co-principal-investigator": "Co-Principal Investigators",
  "project-management": "Project Management",
  "research-staff": "Research Staff",
};
export const metadata = {
  title: "About — NC4SCM",
  description:
    "Meet the people and partners advancing sustainable construction materials in Pakistan.",
};

export default async function AboutPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const p = data.page || {};
  const partnerNames = new Set(
    (data.partners || []).map((partner) =>
      partner.organizationName.toLowerCase(),
    ),
  );
  const partners = [
    ...(data.partners || []),
    ...immediatePartners.filter(
      (partner) => !partnerNames.has(partner.organizationName.toLowerCase()),
    ),
  ];
  const hero = urlFor(p.heroImage)
    ?.width(1600)
    .height(1100)
    .fit("crop")
    .auto("format")
    .url();
  return (
    <>
      <section className="about-hero px-6 pb-20 pt-44 sm:px-10 lg:pb-28">
        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="eyebrow text-teal">
              {p.eyebrow || "About the center"}
            </p>
            <h1 className="mt-7 max-w-5xl font-sans text-6xl font-medium leading-[.92] tracking-[-.06em] text-carbon sm:text-8xl">
              {p.headline || "Research with the reach to reshape construction."}
            </h1>
          </div>
          <p className="max-w-xl border-l border-carbon/15 pl-7 text-lg leading-8 text-carbon/65">
            {p.introduction ||
              "NC4SCM is a national platform connecting materials science, engineering practice, and industry implementation."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-paper">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          {hero && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-forest/10 shadow-float">
              <Image
                src={hero}
                alt={p.heroImage?.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className={hero ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : "grid gap-6 lg:col-span-2 lg:grid-cols-2"}>
            <Story
              label="Our mission"
              title={p.missionHeading || centreContent.mission}
              body={p.mission}
            />
            <Story
              label="Our vision"
              title={p.visionHeading || centreContent.vision}
              body={p.vision}
            />
          </div>
        </div>
      </section>
      <section className="journey-editorial section-shell overflow-hidden">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow text-clay">How we began</p>
            <h2 className="mt-5 font-sans text-5xl font-medium leading-[.92] tracking-[-.055em] text-carbon sm:text-7xl">
              Our journey,<br />built year by year.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-carbon/60 lg:justify-self-end">
            Six years of evidence, standardisation, industry engagement, and
            practical demonstration created the foundation for NC4SCM.
          </p>
        </div>
        <div className="journey-editorial-list relative z-10 mt-20">
          {(p.journey?.length ? p.journey : journey).map((item, index) => (
            <Reveal
              key={item.year}
              className={`journey-editorial-row ${index % 2 ? "is-right" : "is-left"}`}
              delay={(index % 3) * 90}
            >
              <article className="journey-editorial-card group">
                <span className="journey-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="journey-year">
                  {item.year}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-carbon">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-carbon/58">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <p className="eyebrow text-clay">People</p>
        <div className="mt-5 grid gap-8 border-b border-forest/15 pb-10 lg:grid-cols-2">
          <h2 className="font-sans text-4xl font-medium leading-[1.02] tracking-[-.045em] text-forest sm:text-6xl">
            {p.teamHeading || "The team behind the work."}
          </h2>
          <p className="self-end text-base leading-7 text-carbon/65">
            {p.teamIntroduction ||
              "Researchers, engineers, and project professionals working across the full materials innovation pathway."}
          </p>
        </div>
        {Object.entries(groups).map(([key, label]) => {
          const members = (data.team || []).filter((m) => m.group === key);
          const cards = members.length ? members : Array.from({ length: key === "research-staff" ? 4 : 2 }, (_, index) => ({ _id: `${key}-placeholder-${index}`, placeholder: true, fullName: "Profile to be added", position: label }));
          return (
            <div key={key} className="mt-16">
              <h3 className="eyebrow text-clay">{label}</h3>
              <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((m) => (
                  <article key={m._id} className="premium-card group p-3">
                    <a href={m.linkedinUrl || undefined} target={m.linkedinUrl ? "_blank" : undefined} rel={m.linkedinUrl ? "noreferrer" : undefined} aria-label={m.linkedinUrl ? `View ${m.fullName} on LinkedIn` : undefined} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-sage">
                      {m.avatar && (
                        <Image
                          src={urlFor(m.avatar)
                            ?.width(600)
                            .height(750)
                            .fit("crop")
                            .url()}
                          alt={m.avatar.alt || m.fullName}
                          fill
                          className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                        />
                      )}
                      {!m.avatar && <div className="grid h-full place-items-center text-xs font-semibold uppercase tracking-[.15em] text-forest/30">Photo pending</div>}
                    </a>
                    <h4 className="mt-5 px-2 font-sans text-2xl font-semibold tracking-tight text-forest">
                      {m.fullName}
                    </h4>
                    <p className="mt-1 px-2 text-sm text-carbon/55">{m.position}</p>
                    <div className="mt-3 flex gap-4 px-2 pb-3 text-xs font-semibold text-teal">
                      {m.email && <a href={`mailto:${m.email}`}>Email</a>}
                      {m.linkedinUrl && (
                        <a
                          href={m.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          LinkedIn ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
      <section className="overflow-hidden bg-[#0b282d] py-24 text-ivory lg:py-32">
        <div className="px-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-1400px)/2))]">
        <p className="eyebrow text-mint/65">Organized & supported by</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <h2 className="section-title">
            {p.partnersHeading || "Partnership makes impact possible."}
          </h2>
          <p className="self-end text-base leading-7 text-ivory/60">
            {p.partnersIntroduction ||
              "Our funders, academic collaborators, and industry partners strengthen the route from research to adoption."}
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
        <p className="eyebrow text-teal">{label}</p>
      </div>
      <h2 className="mt-8 font-sans text-2xl font-medium leading-[1.2] tracking-[-.03em] text-forest sm:text-3xl">
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
