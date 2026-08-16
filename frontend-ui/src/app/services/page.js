import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanityClient";

const QUERY = `{"settings":*[_type=="pageSettings"][0],"services":*[_type=="service"]|order(displayOrder asc){_id,title,slug,summary,image,methods,deliverables}}`;
export const metadata = {
  title: "Services — NC4SCM",
  description:
    "Technical services for LC3, material characterization, new material development, and implementation support.",
};
export default async function ServicesPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  return (
    <>
      <section className="bg-forest px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Technical services</p>
          <h1 className="mt-7 max-w-5xl font-display text-6xl leading-[.9] sm:text-8xl">
            {data.settings?.servicesHeadline ||
              "Move from material question to verified answer."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {data.settings?.servicesIntroduction ||
              "Rigorous testing, applied research, and implementation support designed around the realities of the construction-materials sector."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div className="space-y-20">
          {(data.services || []).map((s, i) => {
            const image = urlFor(s.image)
              ?.width(900)
              .height(700)
              .fit("crop")
              .url();
            return (
              <article
                key={s._id}
                className="grid gap-10 border-t border-forest/15 pt-10 lg:grid-cols-[.8fr_1.2fr]"
              >
                <div>
                  <p className="eyebrow text-clay">Service 0{i + 1}</p>
                  <h2 className="mt-5 font-display text-4xl leading-tight text-forest sm:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-7 text-carbon/65">
                    {s.summary}
                  </p>
                  <Link
                    href={`/services/${s.slug?.current}`}
                    className="button button-dark mt-8"
                  >
                    Explore service <span>↗</span>
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {image && (
                    <div className="relative min-h-72 overflow-hidden rounded-[2rem] sm:col-span-2">
                      <Image
                        src={image}
                        alt={s.image?.alt || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Mini title="Methods" items={s.methods} />
                  <Mini title="Deliverables" items={s.deliverables} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-mint px-6 py-24 text-center">
        <p className="eyebrow text-clay">Not sure where to begin?</p>
        <h2 className="mx-auto mt-5 max-w-3xl font-display text-5xl text-forest">
          Start with the material challenge, not the service name.
        </h2>
        <Link href="/contact" className="button button-dark mt-8">
          Talk to our team <span>↗</span>
        </Link>
      </section>
    </>
  );
}
function Mini({ title, items = [] }) {
  return (
    <div className="rounded-2xl bg-sage p-6">
      <p className="eyebrow text-clay">{title}</p>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-carbon/65">
        {items.slice(0, 4).map((x) => (
          <li key={x}>— {x}</li>
        ))}
      </ul>
    </div>
  );
}
