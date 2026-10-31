import Link from "next/link";
import Image from "next/image";
import ServiceIcon from "./ServiceIcon";
import { urlFor } from "@/lib/image-url";
export default function ServiceCards({ services = [], text = {} }) {
  return (
    <div className="service-editorial-grid">
      {services.map((service, index) => {
        const image = urlFor(service.image)
          ?.width(900)
          .height(600)
          .fit("crop")
          .url();
        return (
          <article key={service._id} className="service-editorial-card group">
            <div className="service-card-top">
              <span className="service-icon">
                <ServiceIcon
                  variant={(service.displayOrder || index + 1) - 1}
                />
              </span>
              <span className="service-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            {image && (
              <div className="service-card-photo relative mb-4 aspect-[3/2] overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt={service.image?.alt || service.title}
                  fill
                  sizes="(max-width: 800px) 90vw, 45vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <h2 className="service-card-title">{service.title}</h2>
            {service.summary && (
              <p className="service-card-summary">{service.summary}</p>
            )}
            {service.slug?.current && (
              <Link
                href={`/services/${service.slug.current}`}
                className="service-card-link"
              >
                <span>{text.exploreService}</span>
                <span className="service-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
