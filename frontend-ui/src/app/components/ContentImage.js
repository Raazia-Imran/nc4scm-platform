import Image from "next/image";
import { urlFor } from "@/lib/image-url";

// One automatic layout for photos, posters and future CMS cover uploads.
export default function ContentImage({ image, fallbackAlt = "", viewLabel, className = "", priority = false }) {
  const builder = urlFor(image)?.ignoreImageParams();
  if (!builder) return null;
  const original = builder.url();
  const preview = urlFor(image)?.ignoreImageParams().width(1400).fit("max").auto("format").url();
  const dimensions = image.asset?._ref?.match(/-(\d+)x(\d+)-[a-zA-Z0-9]+$/);
  return (
    <figure className={`content-image ${className}`}>
      <div className="content-image-stage">
        <Image
          src={preview}
          alt={image.alt || fallbackAlt}
          width={Number(dimensions?.[1]) || 1200}
          height={Number(dimensions?.[2]) || 800}
          priority={priority}
          sizes="(max-width: 767px) 90vw, 720px"
          className="content-image-preview"
        />
      </div>
      <figcaption>
        <a className="text-link" href={original} target="_blank" rel="noopener noreferrer">
          {viewLabel}<span aria-hidden="true"> ↗</span>
        </a>
      </figcaption>
    </figure>
  );
}
