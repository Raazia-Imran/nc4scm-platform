"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanityClient";

export default function PartnerRail({ partners }) {
  const visiblePartners = partners.length ? partners : [];
  const placeholders = Array.from(
    { length: Math.max(0, 6 - visiblePartners.length) },
    (_, index) => ({
      _id: `partner-placeholder-${index}`,
      organizationName: "Partner logo pending",
      isPlaceholder: true,
    }),
  );
  const items = [...visiblePartners, ...placeholders];
  const loop = [...items, ...items];

  return (
    <div className="partner-rail" aria-label="NC4SCM partner organizations">
      <div className="partner-track">
        {loop.map((partner, index) => (
          <PartnerCard
            key={`${partner._id}-${index}`}
            partner={partner}
            duplicate={index >= items.length}
          />
        ))}
      </div>
    </div>
  );
}

function PartnerCard({ partner, duplicate }) {
  const image = partner.localLogo
    ? partner.localLogo
    : urlFor(partner.logo)?.width(360).height(180).fit("max").url();
  const content = (
    <>
      <div className="partner-logo-surface">
        {image ? (
          <Image
            src={image}
            alt={duplicate ? "" : partner.logo?.alt || partner.organizationName}
            width={220}
            height={110}
            className="h-20 w-full object-contain sm:h-24"
          />
        ) : (
          <span className="partner-placeholder" aria-hidden="true">
            <span>Logo</span>
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-semibold text-ivory">
        {partner.isPlaceholder ? "Partner to be confirmed" : partner.organizationName}
      </p>
    </>
  );
  const className = "partner-rail-card group";

  return partner.targetUrl && !duplicate ? (
    <Link href={partner.targetUrl} target="_blank" className={className}>
      {content}
    </Link>
  ) : (
    <article className={className} aria-hidden={duplicate || undefined}>
      {content}
    </article>
  );
}
