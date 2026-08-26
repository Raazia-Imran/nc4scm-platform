import Link from "next/link";
import { centreContent } from "@/content/clientContent";

const primary = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Research", href: "/publications" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function SiteFooter({ settings }) {
  const nav = settings?.navigation?.length ? settings.navigation : primary;
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:py-24">
        <div className="grid gap-12 border-b border-ivory/15 pb-14 lg:grid-cols-[1.35fr_.65fr_.65fr_.85fr]">
          <div>
            <p className="font-display text-4xl font-medium sm:text-5xl">
              {settings?.shortName || "NC4SCM"}
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-ivory/65">
              {settings?.missionLine ||
                "Advancing low-carbon construction materials through research, testing, and meaningful industry collaboration."}
            </p>
          </div>
          <div>
            <p className="footer-label">Explore</p>
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
            <p className="footer-label">Services</p>
            <ul className="mt-5 space-y-3">
              {(settings?.footerServiceLinks || []).map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link className="footer-link" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-label">Connect</p>
            <div className="mt-5 space-y-3 text-sm leading-6 text-ivory/65">
              {settings?.address && (
                <p className="whitespace-pre-line">{settings.address}</p>
              )}
              <a
                className="footer-link block"
                href={"mailto:" + (settings?.email || centreContent.email)}
              >
                {settings?.email || centreContent.email}
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
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.copyrightText ||
              "NC4SCM, NED University of Engineering & Technology"}
          </p>
          <p>Research · Industry · Impact</p>
        </div>
      </div>
    </footer>
  );
}
