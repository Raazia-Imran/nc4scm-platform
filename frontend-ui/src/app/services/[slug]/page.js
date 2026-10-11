import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";
import { getSiteContent } from "@/lib/content";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import ServiceIcon from "@/app/components/ServiceIcon";
const QUERY = `*[_type=="service"&&slug.current==$slug][0]{title,summary,image,body,methods,deliverables,displayOrder}`;
export async function generateMetadata({ params }) {
  const service = await client.fetch(QUERY, { slug: params.slug });
  return {
    title: service?.title,
    description: service?.summary,
    alternates: { canonical: `/services/${params.slug}` },
  };
}
export default async function ServiceDetail({ params }) {
  const [service, site] = await Promise.all([
    client.fetch(QUERY, { slug: params.slug }),
    getSiteContent(),
  ]);
  if (!service) notFound();
  const text = site.interfaceText || {};
  const image = urlFor(service.image)
    ?.width(1600)
    .height(1000)
    .fit("crop")
    .auto("format")
    .url();
  return (
    <>
      <Link href="/services" className="detail-return button button-dark">← {text.allServices}</Link>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <Link href="/services" className="eyebrow text-mint">
            ← {text.allServices}
          </Link>
          <div className="mt-8 flex items-center gap-4 text-mint">
            <ServiceIcon variant={(service.displayOrder || 1) - 1} />
            <span className="eyebrow">{text.technicalServices}</span>
          </div>
          <h1 className="page-hero-title mt-5">{service.title}</h1>
          <p className="page-hero-intro">{service.summary}</p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div
          className={
            image ? "service-description has-image" : "service-description"
          }
        >
          <div className="service-body service-overview">
            <h2 className="eyebrow text-clay">{text.fullDescription}</h2>
            <div className="mt-4"><RichTextRenderer value={service.body} /></div>
          </div>
          {image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Image
                src={image}
                alt={service.image?.alt || service.title}
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
        <div className="service-detail-columns">
          <List title={text.methods} items={service.methods} moreLabel={text.readMore} />
          <List title={text.deliverables} items={service.deliverables} moreLabel={text.readMore} />
        </div>
      </section>
      <section className="service-contact section-shell">
        <h2 className="section-title">{text.serviceContactHeading}</h2>
        <Link
          href={`/contact?service=${encodeURIComponent(params.slug)}`}
          className="button button-dark"
        >
          {text.requestConsultation}
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  );
}
function List({ title, items, moreLabel }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <div className="service-detail-list">
      <h2 className="eyebrow text-clay">{title}</h2>
      <ul className="mt-6 divide-y divide-forest/15">
        {items.map((item, index) => (
          <li key={index}>
            <span className="service-list-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

    </div>
  );
}
