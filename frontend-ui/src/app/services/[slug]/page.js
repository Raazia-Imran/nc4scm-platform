import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import JsonLd from "@/app/components/JsonLd";
import { buildMetadata, ORGANIZATION_NAME, SITE_URL, sanityImageUrl } from "@/lib/seo";

const QUERY = `*[_type=="service"&&slug.current==$slug][0]{title,slug,summary,image,body,methods,deliverables}`;

export async function generateMetadata({ params }) {
  const service = await client
    .fetch(QUERY, { slug: params.slug })
    .catch(() => null);
  if (!service) {
    return buildMetadata({
      title: "Service Not Found",
      path: `/services/${params.slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${service.title} Services`,
    description: service.summary,
    path: `/services/${service.slug.current}`,
    image: service.image,
    imageAlt: service.image?.alt || service.title,
    keywords: [service.title, "construction materials technical services"],
  });
}

export default async function ServiceDetail({ params }) {
  const service = await client
    .fetch(QUERY, { slug: params.slug })
    .catch(() => null);
  if (!service) notFound();
  const image = urlFor(service.image)
    ?.width(1600)
    .height(1000)
    .fit("crop")
    .auto("format")
    .url();
  const canonical = `${SITE_URL}/services/${service.slug.current}`;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}/#service`,
    name: service.title,
    description: service.summary,
    url: canonical,
    image: sanityImageUrl(service.image),
    provider: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Pakistan" },
  };
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <section className="bg-forest px-6 pb-20 pt-44 text-ivory sm:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/services" className="eyebrow text-mint">
            ← All services
          </Link>
          <h1 className="mt-8 max-w-5xl font-display text-6xl leading-[.93] sm:text-8xl">
            {service.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ivory/70">
            {service.summary}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_.85fr]">
          {image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Image
                src={image}
                alt={service.image?.alt || `${service.title} at NC4SCM`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="text-base leading-8 text-carbon/70">
            <RichTextRenderer value={service.body} />
          </div>
        </div>
        <div className="mt-20 grid gap-10 border-t border-forest/15 pt-12 md:grid-cols-2">
          <List title="Methods & capabilities" items={service.methods} />
          <List title="Typical deliverables" items={service.deliverables} />
        </div>
      </section>
      <section className="bg-mint px-6 py-20 text-center">
        <h2 className="font-display text-5xl text-forest">
          Discuss your technical requirements.
        </h2>
        <Link
          href={`/contact?service=${params.slug}`}
          className="button button-dark mt-8"
        >
          Request consultation <span>↗</span>
        </Link>
      </section>
    </>
  );
}

function List({ title, items }) {
  const visibleItems = Array.isArray(items) ? items : [];
  return (
    <div>
      <p className="eyebrow text-clay">{title}</p>
      {visibleItems.length ? (
        <ul className="mt-6 divide-y divide-forest/15">
          {visibleItems.map((item, index) => (
            <li key={item} className="flex gap-5 py-4">
              <span className="text-xs text-clay">0{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm leading-6 text-carbon/55">
          Details will be added by the NC4SCM team.
        </p>
      )}
    </div>
  );
}
