export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nc4scm.org";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
