import Image from "next/image";
import { urlFor } from "@/sanityClient";

export default function TestimonialShowcase({ testimonials = [] }) {
  const placeholders = Array.from({ length: Math.max(0, 4 - testimonials.length) }, (_, i) => ({ _id: `testimonial-placeholder-${i}`, placeholder: true }));
  const items = [...testimonials, ...placeholders];
  const cycle = Array.from(
    { length: Math.max(8, items.length) },
    (_, index) => items[index % items.length],
  );
  return (
    <section className="section-shell bg-[#0b282d] text-ivory">
      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
        <div>
          <p className="eyebrow text-mint/65">Perspectives</p>
          <h2 className="mt-5 font-sans text-5xl font-medium leading-[.95] tracking-[-.05em]">What collaborators say.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-ivory/55 lg:justify-self-end">Testimonials are managed in Sanity. Empty cards remain intentionally reserved until client-approved statements are supplied.</p>
      </div>
      <div className="testimonial-viewport mt-12">
        <div className="testimonial-grid">
          {[0, 1].map((groupIndex) => (
            <div
              className="testimonial-loop-group"
              key={groupIndex}
              aria-hidden={groupIndex === 1 || undefined}
            >
              {cycle.map((item, index) => {
                const portrait = item.portrait ? urlFor(item.portrait)?.width(160).height(160).fit("crop").url() : null;
                return (
                  <article key={`${item._id}-${groupIndex}-${index}`} aria-hidden={groupIndex === 1 || index >= items.length || undefined} className="testimonial-card">
                    {item.placeholder ? (
                      <><span className="testimonial-mark">“</span><p className="mt-14 text-sm text-forest/45">Client-approved testimonial will appear here.</p><div className="mt-8 h-px bg-forest/10" /></>
                    ) : (
                      <><span className="testimonial-mark">“</span><blockquote className="mt-8 text-lg leading-8 text-forest">{item.quote}</blockquote><div className="mt-8 flex items-center gap-3">{portrait && <Image src={portrait} alt={item.portrait?.alt || item.personName} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />}<div><p className="font-semibold text-forest">{item.personName}</p><p className="text-xs text-carbon/50">{[item.role, item.organization].filter(Boolean).join(" · ")}</p></div></div></>
                    )}
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
