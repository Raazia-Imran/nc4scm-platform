"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { urlFor } from "@/sanityClient";

const FALLBACK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Research", href: "/publications" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader({ settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = settings?.navigation?.length
    ? settings.navigation
    : FALLBACK_LINKS;
  const logoUrl = urlFor(settings?.logo)
    ?.width(360)
    .height(120)
    .fit("max")
    .url();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-forest/10 bg-ivory/90 px-4 py-3 shadow-float backdrop-blur-xl sm:px-6"
      >
        <Link
          href="/"
          aria-label="NC4SCM home"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          {(
            <Image
              src={logoUrl || "/media/brand/nc4scm-logo.webp"}
              alt={settings?.logo?.alt || settings?.shortName || "NC4SCM"}
              width={260}
              height={72}
              className="h-9 w-auto max-w-[12rem] object-contain sm:h-10 sm:max-w-[14rem]"
              priority
            />
          )}
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                target={item.openInNewTab ? "_blank" : undefined}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")) ? "bg-forest text-ivory shadow-[0_8px_24px_rgba(18,61,47,.18)]" : "text-forest/75 hover:bg-sage hover:text-forest"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            href={settings?.headerCta?.href || "/contact"}
            className="hidden rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition hover:-translate-y-0.5 hover:bg-moss sm:inline-flex"
          >
            {settings?.headerCta?.label || "Start a conversation"}
            <span aria-hidden="true" className="ml-2">
              ↗
            </span>
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="text-xl leading-none">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-2 max-w-[1400px] overflow-hidden rounded-[2rem] border border-forest/10 bg-ivory p-5 shadow-float lg:hidden"
        >
          <ul className="divide-y divide-forest/10">
            {links.map((item, index) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 font-display text-2xl text-forest"
                >
                  <span>{item.label}</span>
                  <span className="font-sans text-xs text-clay">
                    0{index + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={settings?.headerCta?.href || "/contact"}
            onClick={() => setOpen(false)}
            className="mt-5 flex justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory"
          >
            {settings?.headerCta?.label || "Start a conversation"}
          </Link>
        </div>
      )}
    </header>
  );
}
