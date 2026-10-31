export default function robots() {
  const base = "https://www.nc4scm.com";
  return {
    rules: { userAgent: "*", allow: "/" }, // Leave crawling available so preview noindex can be read.
    sitemap: `${base}/sitemap.xml`,
  };
}
