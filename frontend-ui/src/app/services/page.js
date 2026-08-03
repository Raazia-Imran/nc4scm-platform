// src/app/services/page.js
// -----------------------------------------------------------------------------
// The Services Portal. Fetches every "service" document (LC3 Technology,
// Material Characterization, New Material Development, Technological
// Support, plus any future additions) and renders each as an expandable
// card. The rich-text `body` field is rendered via the shared
// RichTextRenderer component so formatting stays consistent with the News
// article pages.
// -----------------------------------------------------------------------------
import {client} from '@/sanityClient'
import RichTextRenderer from '@/app/components/RichTextRenderer'

const SERVICES_QUERY = `*[_type == "service"] | order(displayOrder asc){
  _id, title, summary, body
}`

export const metadata = {
  title: 'Services — NC4SCM',
}

export default async function ServicesPage() {
  const services = await client.fetch(SERVICES_QUERY)

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10">
      <h1 className="font-display text-4xl leading-tight text-ink">Services Portal</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
        Four core service lines through which NC4SCM partners with industry,
        government, and academic institutions.
      </p>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        {services && services.length > 0 ? (
          services.map((service) => (
            <article key={service._id} className="border-t border-stone/30 pt-8">
              <h2 className="font-display text-2xl text-ink">{service.title}</h2>
              <p className="mt-3 text-sm uppercase tracking-widest text-stone">{service.summary}</p>
              {/* Null-check: `body` is optional in the schema, so we only
                  render the rich text block if it actually exists. */}
              {service.body && (
                <div className="mt-6 text-sm leading-relaxed text-ink/90">
                  <RichTextRenderer value={service.body} />
                </div>
              )}
            </article>
          ))
        ) : (
          <p className="text-sm text-stone">Service listings will appear here once published.</p>
        )}
      </div>
    </section>
  )
}
