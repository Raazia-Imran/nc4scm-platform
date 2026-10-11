import Image from "next/image";
import { urlFor } from "@/sanityClient";
export default function TestimonialShowcase({ testimonials = [], text = {} }) {
  const items = testimonials.filter(
    (item) =>
      item.quote &&
      item.personName &&
      item.publicationApproved === true &&
      item.published === true,
  );
  if (!items.length) return null;
  return (
    <section className="section-shell bg-forest text-ivory">
      <p className="eyebrow text-mint">{text.perspectives}</p>
      <h2 className="section-title mt-5 !text-ivory">
        {text.testimonialsHeading}
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => {
          const portrait = urlFor(item.portrait)
            ?.width(160)
            .height(160)
            .fit("crop")
            .url();
          return (
            <figure
              key={item._id}
              className="rounded-[2rem] border border-mint/20 p-6 sm:p-9"
            >
              <blockquote className="text-xl leading-9">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                {portrait && (
                  <Image
                    src={portrait}
                    alt={item.portrait?.alt || item.personName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.personName}</p>
                  <p className="mt-1 text-sm text-ivory/65">
                    {[item.role, item.organization].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
