import { client } from "@/sanityClient";
export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nc4scm.org";
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/publications",
    "/events",
    "/news",
    "/contact",
  ];
  const dynamic = await client
    .fetch(
      `*[_type in ["service","event","news"]&&defined(slug.current)]{_type,"slug":slug.current,_updatedAt}`,
    )
    .catch(() => []);
  const prefix = { service: "services", event: "events", news: "news" };
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path ? "weekly" : "daily",
      priority: path?.length ? 0.8 : 1,
    })),
    ...dynamic.map((x) => ({
      url: `${base}/${prefix[x._type]}/${x.slug}`,
      lastModified: x._updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
