import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanityClient";

export default function SiteFooter({ settings }) {
  const nav = settings?.navigation || [];
  const text = settings?.interfaceText || {};
  const logoUrl = urlFor(settings?.logo)
    ?.width(520)
    .height(150)
    .fit("max")
    .url();
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:py-24">
        <div className="grid gap-12 border-b border-ivory/15 pb-14 lg:grid-cols-[1.35fr_.65fr_.65fr_.85fr]">
          <div>
            {logoUrl ? (
              <div className="inline-flex rounded-xl bg-ivory px-4 py-3">
                <Image
                  src={logoUrl}
                  alt={settings?.logo?.alt || settings?.organizationName || ""}
                  width={260}
                  height={72}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ) : (
              <p className="font-display text-4xl">
                {settings?.shortName || settings?.organizationName}
              </p>
            )}
            <p className="mt-5 max-w-md text-sm leading-7 text-ivory/65">
              {settings?.missionLine}
            </p>
          </div>
          <div>
            <p className="footer-label">{text.explore}</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link className="footer-link" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-label">{text.services}</p>
            <ul className="mt-5 space-y-3">
              {(settings?.footerServiceLinks?.length
                ? settings.footerServiceLinks
                : settings?.resolvedServiceLinks || []
              ).map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link className="footer-link" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-label">{text.connect}</p>
            <div className="mt-5 space-y-3 text-sm leading-6 text-ivory/65">
              {settings?.address && (
                <p className="whitespace-pre-line">{settings.address}</p>
              )}
              <a
                className="footer-link block"
                href={settings?.email ? `mailto:${settings.email}` : undefined}
              >
                {settings?.email}
              </a>
              {settings?.phone && (
                <a className="footer-link block" href={`tel:${settings.phone}`}>
                  {settings.phone}
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  className="footer-link block"
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.linkedin} ↗
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings?.copyrightText}</p>
          <p>{text.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}
