import EmailLinks from "@/app/components/EmailLinks";
import CompactText from "@/app/components/CompactText";
import { Suspense } from "react";
import { client } from "@/sanityClient";
import { getSiteContent } from "@/lib/content";
import ContactForm from "./ContactForm";
export async function generateMetadata() {
  const p = await client.fetch('*[_type=="pageSettings"][0]');
  return {
    title: p?.contactHeadline,
    description: p?.contactIntroduction,
    alternates: { canonical: "/contact" },
  };
}
export default async function ContactPage() {
  const [site, page, services] = await Promise.all([
    getSiteContent(),
    client.fetch('*[_type=="pageSettings"][0]'),
    client.fetch('*[_type=="service"]{title,slug}'),
  ]);
  const text = site.interfaceText || {},
    coordinates =
      Number.isFinite(site.latitude) && Number.isFinite(site.longitude);
  const map = site.mapEmbedUrl;
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <p className="eyebrow text-mint">{text.contact}</p>
          <h1 className="page-hero-title mt-6">{page?.contactHeadline}</h1>
          <CompactText className="page-hero-intro" value={page?.contactIntroduction} label={text.readMore} />
        </div>
      </section>
      <section className="section-shell marble-surface">
        <div className="contact-layout">
          <aside className="contact-information">
            <h2 className="eyebrow text-clay">{text.contactDetails}</h2>
            {site.address && <Info label={text.visit} value={site.address} />}
            {site.email && (
              <div className="contact-person"><p className="eyebrow text-clay">{text.centreEmail}</p><EmailLinks email={site.email} text={text} showAddress /></div>
            )}
            {site.phone && (
              <Info
                label={text.call}
                value={site.phone}
                href={`tel:${site.phone.replace(/\s/g, "")}`}
              />
            )}
            {(site.contactPeople || []).map((person) => (
              <div key={person._key || person.email} className="contact-person">
                <p className="eyebrow text-clay">{person.role}</p>
                <h3 className="mt-3 text-xl text-forest">{person.name}</h3>
                {person.email && (
                  <EmailLinks email={person.email} text={text} showAddress />
                )}
                {person.phone && (
                  <a
                    href={`tel:${person.phone.replace(/\s/g, "")}`}
                    className="mt-2 block text-sm"
                  >
                    {person.phone}
                  </a>
                )}
              </div>
            ))}
            {site.linkedinUrl && (
              <Info
                label={text.follow}
                value={text.linkedin}
                href={site.linkedinUrl}
              />
            )}
          </aside>
          <div className="premium-card contact-form-card p-5 sm:p-6">
            <p className="eyebrow text-clay">{text.sendEnquiry}</p>
            <h2 className="mb-5 mt-3 text-[clamp(1.4rem,2vw,1.75rem)] font-medium leading-tight text-forest">
              {text.enquiryHeading}
            </h2>
            <Suspense fallback={<p>{text.loadingForm}</p>}>
              <ContactForm
                successMessage={page?.contactSuccessMessage}
                recipientEmail={site.email}
                services={services}
              />
            </Suspense>
          </div>
        </div>
        {(map || coordinates) && (
          <div className="mt-12 overflow-hidden rounded-[2rem] border border-forest/15 bg-sage">
            <div className={map ? "grid lg:grid-cols-[.72fr_1.28fr]" : ""}>
              <div className="p-6 sm:p-10">
                <p className="eyebrow text-clay">{text.findUs}</p>
                <h2 className="mt-5 text-3xl text-forest">{text.mapHeading}</h2>
                {coordinates && (
                  <>
                    <p className="mt-5 text-sm">
                      {text.coordinates}: {site.latitude}, {site.longitude}
                    </p>
                    <a
                      className="text-link mt-7 inline-flex"
                      href={`https://www.openstreetmap.org/?mlat=${site.latitude}&mlon=${site.longitude}#map=17/${site.latitude}/${site.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {text.openMap}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </>
                )}
              </div>
              {map && (
                <iframe
                  src={map}
                  title={text.location}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[260px] w-full border-0 lg:h-full lg:min-h-[280px]"
                />
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
function Info({ label, value, href }) {
  return (
    <div className="contact-person">
      <p className="eyebrow text-clay">{label}</p>
      {href ? (
        <a
          href={href}
          className="mt-3 block text-base leading-7 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-3 whitespace-pre-line leading-7">{value}</p>
      )}
    </div>
  );
}
