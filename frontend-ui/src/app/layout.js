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
// src/app/layout.js
// src/app/layout.js
import "./globals.css";
import { client } from "@/sanityClient";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export const revalidate = 60;

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nc4scm.com",
  ),
  title: "NC4SCM — National Center for Sustainable Construction Materials",
  description:
    "NC4SCM advances sustainable construction materials research, including LC3 technology, material characterization, and new material development.",
  openGraph: {
    title: "NC4SCM — National Center for Sustainable Construction Materials",
    description:
      "NC4SCM advances sustainable construction materials research, including LC3 technology, material characterization, and new material development.",
    url: "https://nc4scm.com",
    siteName: "NC4SCM",
    images: [
      {
        url: "/media/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NC4SCM Preview Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NC4SCM — National Center for Sustainable Construction Materials",
    description:
      "NC4SCM advances sustainable construction materials research, including LC3 technology, material characterization, and new material development.",
    images: ["/media/opengraph-image.png"],
  },
};

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{organizationName, shortName, logo, missionLine, navigation, headerCta, footerServiceLinks, address, email, phone, linkedinUrl, copyrightText}`;

export default async function RootLayout({ children }) {
  const settings = await client.fetch(SETTINGS_QUERY).catch(() => null);
  return (
    <html lang="en">
      <body className="bg-ivory text-carbon font-sans antialiased">
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
