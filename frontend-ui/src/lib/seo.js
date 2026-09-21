import { urlFor } from "@/sanityClient";

export const SITE_URL = "https://nc4scm.com";
export const SITE_NAME = "NC4SCM";
export const ORGANIZATION_NAME =
  "National Center for Sustainable Construction Materials";

export const DEFAULT_DESCRIPTION =
  "NC4SCM advances low-carbon construction materials through research, testing, technical services, and industry collaboration in Pakistan.";

export const DEFAULT_KEYWORDS = [
  "NC4SCM",
  "National Center for Sustainable Construction Materials",
  "sustainable construction materials",
  "low-carbon cement",
  "LC3 technology",
  "material characterization",
  "construction materials research",
  "Pakistan",
];

export const DEFAULT_SOCIAL_IMAGE = "/media/brand/nc4scm-logo.webp";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();
}

export function sanityImageUrl(image, width = 1200, height = 630) {
  return image
    ? urlFor(image)
        ?.width(width)
        .height(height)
        .fit("crop")
        .auto("format")
        .url()
    : null;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  keywords = [],
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}) {
  const canonical = absoluteUrl(path);
  const sanitySocialImage = sanityImageUrl(image);
  const socialImage = sanitySocialImage || absoluteUrl(DEFAULT_SOCIAL_IMAGE);
  const fullTitle = title || ORGANIZATION_NAME;
  const openGraph = {
    title: fullTitle,
    description,
    url: canonical,
    siteName: SITE_NAME,
    locale: "en_PK",
    type,
    images: [
      {
        url: socialImage,
        width: sanitySocialImage ? 1200 : 593,
        height: sanitySocialImage ? 630 : 240,
        alt: imageAlt || `${SITE_NAME} — ${ORGANIZATION_NAME}`,
      },
    ],
  };

  if (publishedTime) openGraph.publishedTime = publishedTime;
  if (modifiedTime) openGraph.modifiedTime = modifiedTime;

  return {
    title: fullTitle,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage],
    },
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
