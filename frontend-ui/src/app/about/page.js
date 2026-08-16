import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";

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
              title={
                p.missionHeading ||
                "Accelerate credible low-carbon material solutions."
              }
              body={p.mission}
            />
            <Story
              label="Our vision"
              title={
                p.visionHeading ||
                "A construction sector where performance and climate responsibility reinforce each other."
              }
              body={p.vision}
            />
            <Story
              label="How we began"
              title={
                p.foundingHeading ||
                "Established at NED University with international and industry collaboration."
              }
              body={p.foundingStory}
            />
          </div>
        </div>
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
              {(data.partners || [])
                .filter((x) => x.category === cat)
                .map((x) => (
                  <Link
                    key={x._id}
                    href={x.targetUrl}
                    target="_blank"
                    className="group grid min-h-36 place-items-center border-b border-r border-forest/15 p-7"
                  >
                    <Image
                      src={urlFor(x.logo)
                        ?.width(300)
                        .height(140)
                        .fit("max")
                        .url()}
                      alt={x.logo?.alt || x.organizationName}
                      width={180}
                      height={80}
                      className="max-h-16 w-auto grayscale transition group-hover:grayscale-0"
                    />
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
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
