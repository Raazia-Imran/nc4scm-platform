import "./globals.css";
import { getSiteContent } from "@/lib/content";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import ContentProvider from "@/app/components/ContentProvider";
export const revalidate = 60;
export async function generateMetadata() {
  const site = await getSiteContent();
  const title = site.defaultSeo?.title || site.organizationName;
  const description = site.defaultSeo?.description || site.missionLine;
  const image = {
    url: "https://www.nc4scm.com/media/opengraph-image.jpg",
    width: 1200,
    height: 630,
    alt: site.organizationName,
  };
  return {
    metadataBase: new URL("https://www.nc4scm.com"),
    title,
    description,
    icons: { icon: "/media/favicon.ico" },
    openGraph: {
      title,
      description,
      siteName: site.shortName,
      images: [image],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
export default async function RootLayout({ children }) {
  const settings = await getSiteContent();
  return (
    <html lang="en">
      <body className="bg-ivory text-carbon font-sans antialiased">
        <ContentProvider text={settings.interfaceText}>
          <a href="#main-content" className="skip-link">
            {settings.interfaceText?.skipContent}
          </a>
          <SiteHeader settings={settings} />
          <main id="main-content">{children}</main>
          <SiteFooter settings={settings} />
        </ContentProvider>
      </body>
    </html>
  );
}
