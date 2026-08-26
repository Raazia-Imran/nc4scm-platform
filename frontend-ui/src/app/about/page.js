import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";
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
      <section className="bg-forest px-6 pb-20 pt-44 text-ivory sm:px-10 lg:pb-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="eyebrow text-mint">
              {p.eyebrow || "About the center"}
            </p>
            <h1 className="mt-7 font-display text-6xl leading-[.9] sm:text-8xl">
              {p.headline || "Research with the reach to reshape construction."}
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-ivory/70">
            {p.introduction ||
              "NC4SCM is a national platform connecting materials science, engineering practice, and industry implementation."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div className="grid gap-14 lg:grid-cols-2">
          {hero && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src={hero}
                alt={p.heroImage?.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-14">
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
      <section className="section-shell overflow-hidden bg-forest text-ivory">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow text-mint">How we began</p>
            <h2 className="mt-5 font-display text-5xl leading-[.95] sm:text-7xl">
              Our journey from research to national impact.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-ivory/65 lg:justify-self-end">
            Six years of evidence, standardisation, industry engagement, and
            practical demonstration created the foundation for NC4SCM.
          </p>
        </div>
        <div className="journey-line mt-20">
          {(p.journey?.length ? p.journey : journey).map((item, index) => (
            <article
              key={item.year}
              className="journey-item group"
              style={{ "--journey-index": index }}
            >
              <div className="journey-marker" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="journey-card">
                <p className="font-display text-5xl text-mint sm:text-6xl">
                  {item.year}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-ivory">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-ivory/62">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-14 border-t border-ivory/15 pt-7 text-sm font-semibold tracking-wide text-mint">
          2021 Research → 2022 Standardisation → 2023 Industry Engagement →
          2024 Demonstration → 2025 Global Outreach → 2026 NC4SCM
        </p>
      </section>
      <section className="section-shell bg-limestone">
        <p className="eyebrow text-clay">People</p>
        <div className="mt-5 grid gap-8 border-b border-forest/15 pb-10 lg:grid-cols-2">
          <h2 className="section-title">
            {p.teamHeading || "The team behind the work."}
          </h2>
          <p className="self-end text-base leading-7 text-carbon/65">
            {p.teamIntroduction ||
              "Researchers, engineers, and project professionals working across the full materials innovation pathway."}
          </p>
        </div>
        {Object.entries(groups).map(([key, label]) => {
          const members = (data.team || []).filter((m) => m.group === key);
          if (!members.length) return null;
          return (
            <div key={key} className="mt-16">
              <h3 className="eyebrow text-clay">{label}</h3>
              <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {members.map((m) => (
                  <article key={m._id} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sage">
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
                    </div>
                    <h4 className="mt-5 font-display text-2xl text-forest">
                      {m.fullName}
                    </h4>
                    <p className="mt-1 text-sm text-carbon/55">{m.position}</p>
                    <div className="mt-3 flex gap-4 text-xs font-semibold text-clay">
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
      <section className="section-shell bg-ivory">
        <p className="eyebrow text-clay">Network</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <h2 className="section-title">
            {p.partnersHeading || "Partnership makes impact possible."}
          </h2>
          <p className="self-end text-base leading-7 text-carbon/65">
            {p.partnersIntroduction ||
              "Our funders, academic collaborators, and industry partners strengthen the route from research to adoption."}
          </p>
        </div>
        {["funder", "academic", "industry"].map((cat) => (
          <div key={cat} className="mt-14">
            <p className="eyebrow text-carbon/45">{cat}</p>
            <div className="mt-5 grid grid-cols-2 border-l border-t border-forest/15 sm:grid-cols-3 lg:grid-cols-5">
              {partners
                .filter((x) => x.category === cat)
                .map((x) => (
                  <PartnerCard
                    key={x._id}
                    partner={x}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function PartnerCard({ partner }) {
  const image = partner.localLogo
    ? partner.localLogo
    : urlFor(partner.logo)?.width(300).height(140).fit("max").url();
  const card = (
    <>
      {image && (
        <Image
          src={image}
          alt={partner.logo?.alt || partner.organizationName}
          width={180}
          height={80}
          className="max-h-16 w-auto object-contain grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
        />
      )}
      <span className="sr-only">{partner.organizationName}</span>
    </>
  );
  const className =
    "group grid min-h-40 place-items-center border-b border-r border-forest/15 bg-white/35 p-7 transition hover:bg-white";

  return partner.targetUrl ? (
    <Link href={partner.targetUrl} target="_blank" className={className}>
      {card}
    </Link>
  ) : (
    <div className={className}>{card}</div>
  );
}
function Story({ label, title, body }) {
  return (
    <div className="border-t border-forest/15 pt-6">
      <p className="eyebrow text-clay">{label}</p>
      <h2 className="mt-5 font-display text-4xl leading-tight text-forest">
        {title}
      </h2>
      {body?.length ? (
        <div className="mt-6 text-base leading-8 text-carbon/65">
          <RichTextRenderer value={body} />
        </div>
      ) : null}
    </div>
  );
}
