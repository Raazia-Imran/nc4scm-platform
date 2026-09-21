// src/app/layout.js
// -----------------------------------------------------------------------------
// The Root Layout in Next.js App Router wraps every single page in the
// application. Because it renders once and persists across client-side
// navigations, it's the correct place for anything that should appear on
// every screen: the sticky navigation header and the footer.
//
// This file is a Server Component (no "use client" directive), which means
// it renders on the server with zero client-side JavaScript cost for the
// static nav/footer markup itself — only the interactive bits elsewhere in
// the app (like the contact form) ship their own client-side bundles.
// -----------------------------------------------------------------------------
import "./globals.css";
import { client } from "@/sanityClient";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import JsonLd from "@/app/components/JsonLd";
import {
  buildMetadata,
  ORGANIZATION_NAME,
  SITE_NAME,
  SITE_URL,
  sanityImageUrl,
} from "@/lib/seo";

export const revalidate = 60;

// Centralizing the nav links in one array means adding a new top-level page
// later only requires one edit, instead of hunting through JSX.
const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{organizationName, shortName, logo, missionLine, navigation, headerCta, footerServiceLinks, address, email, phone, linkedinUrl, copyrightText,latitude,longitude,defaultSeo}`;

export async function generateMetadata() {
  const settings = await client.fetch(SETTINGS_QUERY).catch(() => null);
  const seo = settings?.defaultSeo || {};
  const base = buildMetadata({
    title:
      seo.metaTitle ||
      `${SITE_NAME} — ${ORGANIZATION_NAME}`,
    description: seo.metaDescription,
    path: "/",
    image: seo.shareImage,
    imageAlt: settings?.logo?.alt,
    noIndex: seo.hideFromSearch,
  });

  return {
    ...base,
    metadataBase: new URL(SITE_URL),
    title: {
      default: base.title,
      template: `%s | ${SITE_NAME}`,
    },
    applicationName: SITE_NAME,
    category: "Research and education",
  };
}

export default async function RootLayout({ children }) {
  const settings = await client.fetch(SETTINGS_QUERY).catch(() => null);
  const organizationName = settings?.organizationName || ORGANIZATION_NAME;
  const logo = sanityImageUrl(settings?.logo, 600, 300);
  const socialProfiles = [settings?.linkedinUrl].filter(Boolean);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ResearchOrganization"],
        "@id": `${SITE_URL}/#organization`,
        name: organizationName,
        alternateName: settings?.shortName || SITE_NAME,
        url: SITE_URL,
        logo: logo || `${SITE_URL}/media/brand/nc4scm-logo.webp`,
        ...(settings?.missionLine && { description: settings.missionLine }),
        ...(settings?.email && { email: settings.email }),
        ...(settings?.phone && { telephone: settings.phone }),
        sameAs: socialProfiles,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#research-center`,
        name: organizationName,
        url: SITE_URL,
        image: logo || `${SITE_URL}/media/brand/nc4scm-logo.webp`,
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        address: settings?.address
          ? {
              "@type": "PostalAddress",
              streetAddress: settings.address,
              addressLocality: "Karachi",
              addressCountry: "PK",
            }
          : undefined,
        geo:
          Number.isFinite(settings?.latitude) &&
          Number.isFinite(settings?.longitude)
            ? {
                "@type": "GeoCoordinates",
                latitude: settings.latitude,
                longitude: settings.longitude,
              }
            : undefined,
        ...(settings?.email && { email: settings.email }),
        ...(settings?.phone && { telephone: settings.phone }),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-PK",
      },
    ],
  };
  return (
    <html lang="en">
      <body className="bg-ivory text-carbon font-sans antialiased">
        <JsonLd data={organizationJsonLd} />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader settings={settings} />
        <main id="main-content">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
