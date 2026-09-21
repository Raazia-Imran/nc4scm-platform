import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanityClient";
import ServiceFlipRail from "@/app/components/ServiceFlipRail";
import { buildMetadata } from "@/lib/seo";

const QUERY = `{"settings":*[_type=="pageSettings"][0],"services":*[_type=="service"]|order(displayOrder asc){_id,title,slug,summary,image,methods,deliverables}}`;
const FALLBACK_SERVICES = [
  { _id: "service-lc3-placeholder", title: "LC3 Technology", summary: "Technical guidance for limestone calcined clay cement development and implementation.", methods: [], deliverables: [] },
  { _id: "service-characterization-placeholder", title: "Material Characterization", summary: "Evidence-led assessment of locally available clays and supplementary cementitious materials.", methods: [], deliverables: [] },
  { _id: "service-development-placeholder", title: "New Material Development", summary: "Applied research for lower-carbon, affordable construction-material solutions.", methods: [], deliverables: [] },
  { _id: "service-support-placeholder", title: "Technological Support", summary: "Research-to-industry support for validation, scale-up, and practical adoption.", methods: [], deliverables: [] },
];
export async function generateMetadata() {
  const settings = await client
    .fetch(`*[_type == "pageSettings"][0]{servicesHeadline,servicesIntroduction}`)
    .catch(() => null);
  return buildMetadata({
    title: "Technical Services for Low-Carbon Construction Materials",
    description:
      settings?.servicesIntroduction ||
      "Technical services for LC3, material characterization, new material development, and industrial implementation support.",
    path: "/services",
    keywords: ["LC3 technical services", "material characterization laboratory", "cement industry technical support"],
  });
}
export default async function ServicesPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const services = data.services?.length ? data.services : FALLBACK_SERVICES;
  return (
    <>
      <section className="page-hero px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Technical services</p>
          <h1 className="page-hero-title mt-7">
            {data.settings?.servicesHeadline ||
              "Move from material question to verified answer."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {data.settings?.servicesIntroduction ||
              "Rigorous testing, applied research, and implementation support designed around the realities of the construction-materials sector."}
          </p>
        </div>
      </section>
      <section className="overflow-hidden bg-[#0b282d] px-6 py-20 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]"><p className="eyebrow text-mint/65">Explore capabilities</p><h2 className="mt-5 max-w-3xl font-sans text-4xl font-medium tracking-[-.045em] sm:text-6xl">Technical services, viewed from every angle.</h2><div className="mt-10"><ServiceFlipRail services={services} /></div></div>
      </section>
      <section className="section-shell marble-surface">
        <div className="space-y-20">
          {services.map((s, i) => {
            const image = urlFor(s.image)
              ?.width(900)
              .height(700)
              .fit("crop")
              .url();
            return (
              <article
                key={s._id}
                className="premium-card grid gap-10 p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr]"
              >
                <div>
                  <p className="eyebrow text-clay">Service 0{i + 1}</p>
                  <h2 className="mt-5 font-sans text-4xl font-semibold leading-tight tracking-[-.045em] text-forest sm:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-7 text-carbon/65">
                    {s.summary}
                  </p>
                  <Link
                    href={s.slug?.current ? `/services/${s.slug.current}` : "/contact"}
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
                        alt={s.image?.alt || `${s.title} technical service at NC4SCM`}
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
function Mini({ title, items }) {
  const visibleItems = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl bg-sage p-6">
      <p className="eyebrow text-clay">{title}</p>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-carbon/65">
        {visibleItems.slice(0, 4).map((x) => (
          <li key={x}>— {x}</li>
        ))}
      </ul>
    </div>
  );
}
