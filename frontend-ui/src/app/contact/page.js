import { Suspense } from "react";
import { client } from "@/sanityClient";
import ContactForm from "./ContactForm";
const QUERY = `{"settings":*[_type=="siteSettings"][0]{address,email,phone,mapEmbedUrl,linkedinUrl},"page":*[_type=="pageSettings"][0]{contactHeadline,contactIntroduction,contactSuccessMessage}}`;
export const metadata = {
  title: "Contact — NC4SCM",
  description:
    "Contact NC4SCM for consultancy, collaboration, media, and general enquiries.",
};
export default async function ContactPage() {
  const data = await client.fetch(QUERY).catch(() => ({}));
  const s = data.settings || {},
    p = data.page || {};
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
              {s.email && (
                <Info
                  label="Email"
                  value={s.email}
                  href={`mailto:${s.email}`}
                />
              )}{" "}
              {s.phone && (
                <Info label="Call" value={s.phone} href={`tel:${s.phone}`} />
              )}{" "}
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
        {s.mapEmbedUrl && (
          <div className="mt-20 overflow-hidden rounded-[2rem] bg-sage">
            <iframe
              src={s.mapEmbedUrl}
              title="NC4SCM location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0"
            />
          </div>
        )}
      </section>
    </>
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
