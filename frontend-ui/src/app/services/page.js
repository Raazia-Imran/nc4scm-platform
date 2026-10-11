import CompactText from "@/app/components/CompactText";
import Link from "next/link";
import { client } from "@/sanityClient";
import { getSiteContent } from "@/lib/content";
import ServiceCards from "@/app/components/ServiceCards";
const QUERY = `{"page":*[_type=="pageSettings"][0],"services":*[_type=="service"]|order(displayOrder asc){_id,title,slug,summary,image,displayOrder}}`;
export async function generateMetadata() {
  const page = await client.fetch('*[_type=="pageSettings"][0]');
  return {
    title: page?.servicesHeadline,
    description: page?.servicesIntroduction,
    alternates: { canonical: "/services" },
  };
}
export default async function ServicesPage() {
  const [data, site] = await Promise.all([
    client.fetch(QUERY),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <p className="eyebrow text-mint">{text.technicalServices}</p>
          <h1 className="page-hero-title mt-6">
            {data.page?.servicesHeadline}
          </h1>
          <CompactText className="page-hero-intro" value={data.page?.servicesIntroduction} label={text.readMore} />
        </div>
      </section>
      <section className="section-shell marble-surface">
        <ServiceCards services={data.services} text={text} />
      </section>
      <section className="service-contact section-shell">
        <div>
          <p className="eyebrow text-clay">{text.contact}</p>
          <h2 className="section-title mt-5">{text.serviceContactHeading}</h2>
        </div>
        <Link href="/contact" className="button button-dark">
          {text.requestConsultation}
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  );
}
