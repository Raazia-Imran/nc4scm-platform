"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanityClient";

export default function PartnerRail({ partners }) {
  const rail = useRef(null);
  const [copies, setCopies] = useState(1);
  const visiblePartners = partners.length ? partners : [];
  useEffect(() => {
    if (!rail.current || !visiblePartners.length) return;
    const resize = () => {
      const card = rail.current.querySelector(".partner-rail-card");
      if (!card) return;
      const stride = card.getBoundingClientRect().width + 14.4;
      setCopies(
        Math.max(
          1,
          Math.ceil(
            rail.current.clientWidth / (stride * visiblePartners.length),
          ) + 1,
        ),
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(rail.current);
    resize();
    return () => observer.disconnect();
  }, [visiblePartners.length]);
  if (!visiblePartners.length) return null;

  // A cycle must be wider than the viewport or an ultra-wide screen can
  // briefly expose empty rail space. Repeat the source records until each of
  // the two identical cycles contains at least eight cards.
  const cycle = Array.from(
    { length: copies * visiblePartners.length },
    (_, index) => visiblePartners[index % visiblePartners.length],
  );

  return (
    <div className="partner-rail" ref={rail}>
      <div className="partner-track">
        {[0, 1].map((groupIndex) => (
          <div
            className="partner-loop-group"
            key={groupIndex}
            aria-hidden={groupIndex === 1 || undefined}
          >
            {cycle.map((partner, index) => (
              <PartnerCard
                key={`${partner._id}-${groupIndex}-${index}`}
                partner={partner}
                duplicate={groupIndex === 1 || index >= visiblePartners.length}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerCard({ partner, duplicate }) {
  const image = urlFor(partner.logo)?.width(360).height(180).fit("max").url();
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
            ↗
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-semibold text-ivory">
        {partner.organizationName}
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
