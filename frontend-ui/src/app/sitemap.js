import { client } from "@/sanityClient";
export default async function sitemap() {
  const base = "https://www.nc4scm.com";
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/publications",
    "/events",
    "/news",
    "/contact",
    "/events/timeline",
    "/legacy",
    "/privacy",
    "/cookies",
    "/terms",
  ];
  const dynamic = await client
    .fetch(
      `*[_type in ["service","event","news","contributionProject"]&&defined(slug.current)&&(_type!="contributionProject"||publicationApproved==true)]{_type,"slug":slug.current,_updatedAt}`,
    )
    .catch(() => []);
  const prefix = { contributionProject: "legacy/projects", service: "services", event: "events", news: "news" };
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: path ? "weekly" : "daily",
      priority: path?.length ? 0.8 : 1,
    })),
    ...dynamic.filter((x) => /^[a-zA-Z0-9_-]+$/.test(x.slug)).map((x) => ({
      url: `${base}/${prefix[x._type]}/${x.slug}`,
      lastModified: x._updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
