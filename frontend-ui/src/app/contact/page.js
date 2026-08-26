import { Suspense } from "react";
import { client } from "@/sanityClient";
import ContactForm from "./ContactForm";
import { centreContent } from "@/content/clientContent";
const QUERY = `{"settings":*[_type=="siteSettings"][0]{address,email,phone,contactPeople,mapEmbedUrl,latitude,longitude,linkedinUrl},"page":*[_type=="pageSettings"][0]{contactHeadline,contactIntroduction,contactSuccessMessage}}`;
export const metadata = {
  title: "Contact — NC4SCM",
  description:
    "Contact NC4SCM for consultancy, collaboration, media, and general enquiries.",
};
export default async function ContactPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const s = data.settings || {},
    p = data.page || {};
  const mapUrl =
    s.mapEmbedUrl ||
    "https://www.openstreetmap.org/export/embed.html?bbox=67.106924%2C24.928469%2C67.116924%2C24.938469&layer=mapnik&marker=24.933469%2C67.111924";
  const contacts = s.contactPeople?.length
    ? s.contactPeople
    : centreContent.contacts;
  const latitude = s.latitude ?? centreContent.coordinates.latitude;
  const longitude = s.longitude ?? centreContent.coordinates.longitude;
  return (
    <>
      <section className="bg-forest px-6 pb-24 pt-44 text-ivory sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-mint">Contact</p>
          <h1 className="mt-7 max-w-5xl font-display text-6xl leading-[.9] sm:text-8xl">
            {p.contactHeadline ||
              "Let’s turn a materials challenge into a path forward."}
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-ivory/70">
            {p.contactIntroduction ||
              "Contact the center about technical services, research collaboration, training, media, or institutional partnerships."}
          </p>
        </div>
      </section>
      <section className="section-shell bg-ivory">
        <div className="grid gap-16 lg:grid-cols-[.65fr_1.35fr]">
          <aside>
            <p className="eyebrow text-clay">Contact details</p>
            <div className="mt-7 space-y-8">
              {s.address && <Info label="Visit" value={s.address} />}{" "}
              <Info
                label="Centre email"
                value={s.email || centreContent.email}
                href={"mailto:" + (s.email || centreContent.email)}
              />
              {s.phone && (
                <Info label="Call" value={s.phone} href={`tel:${s.phone}`} />
              )}{" "}
              {contacts.map((contact) => (
                <ContactPerson key={contact.email} contact={contact} />
              ))}
              {s.linkedinUrl && (
                <Info label="Follow" value="LinkedIn ↗" href={s.linkedinUrl} />
              )}
            </div>
          </aside>
          <div>
            <p className="eyebrow text-clay">Send an enquiry</p>
            <h2 className="mt-5 mb-10 font-display text-4xl text-forest">
              Tell us what you are working on.
            </h2>
            <Suspense fallback={<p>Loading form…</p>}>
              <ContactForm successMessage={p.contactSuccessMessage} />
            </Suspense>
          </div>
        </div>
        <div className="mt-20 overflow-hidden rounded-[2rem] border border-forest/10 bg-sage shadow-float">
          <div className="grid lg:grid-cols-[.72fr_1.28fr]">
            <div className="p-8 sm:p-10">
              <p className="eyebrow text-clay">Find us</p>
              <h2 className="mt-5 font-display text-4xl text-forest">
                NED University of Engineering & Technology
              </h2>
              <p className="mt-5 text-sm leading-7 text-carbon/60">
                Coordinates: {latitude}, {longitude}
              </p>
              <a
                className="text-link mt-7 inline-flex"
                href={
                  "https://www.openstreetmap.org/?mlat=" +
                  latitude +
                  "&mlon=" +
                  longitude +
                  "#map=17/" +
                  latitude +
                  "/" +
                  longitude
                }
                target="_blank"
                rel="noreferrer"
              >
                Open full map <span>↗</span>
              </a>
            </div>
            <iframe
              src={mapUrl}
              title="NC4SCM location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0 lg:h-full lg:min-h-[430px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
function ContactPerson({ contact }) {
  return (
    <div className="border-t border-forest/15 pt-5">
      <p className="eyebrow text-carbon/40">{contact.role}</p>
      <p className="mt-3 font-display text-2xl text-forest">{contact.name}</p>
      <div className="mt-3 space-y-1 text-sm text-carbon/65">
        <a className="block hover:text-clay" href={"mailto:" + contact.email}>
          {contact.email}
        </a>
        <a
          className="block hover:text-clay"
          href={"tel:" + contact.phone.replace(/\s/g, "")}
        >
          {contact.phone}
        </a>
      </div>
    </div>
  );
}
function Info({ label, value, href }) {
  const content = (
    <p className="whitespace-pre-line text-base leading-7 text-carbon/70">
      {value}
    </p>
  );
  return (
    <div className="border-t border-forest/15 pt-5">
      <p className="eyebrow mb-3 text-carbon/40">{label}</p>
      {href ? (
        <a href={href} className="hover:text-clay">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
