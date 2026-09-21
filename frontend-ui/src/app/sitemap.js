import { client } from "@/sanityClient";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = [
  { path: "", key: "home", changeFrequency: "weekly", priority: 1 },
  { path: "/about", key: "about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", key: "services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/publications", key: "publications", changeFrequency: "weekly", priority: 0.9 },
  { path: "/events", key: "events", changeFrequency: "weekly", priority: 0.9 },
  { path: "/news", key: "news", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", key: "contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap() {
  const data = await client
    .fetch(
      `{
        "dynamic": *[_type in ["service", "event", "news"] && defined(slug.current)]{
          _type,
          "slug": slug.current,
          _updatedAt
        },
        "updated": {
          "home": *[_type == "homePage"] | order(_updatedAt desc)[0]._updatedAt,
          "about": *[_type in ["aboutPage", "teamMember", "partner"]] | order(_updatedAt desc)[0]._updatedAt,
          "services": *[_type in ["service", "pageSettings"]] | order(_updatedAt desc)[0]._updatedAt,
          "publications": *[_type in ["publication", "pageSettings"]] | order(_updatedAt desc)[0]._updatedAt,
          "events": *[_type in ["event", "pageSettings"]] | order(_updatedAt desc)[0]._updatedAt,
          "news": *[_type in ["news", "pageSettings"]] | order(_updatedAt desc)[0]._updatedAt,
          "contact": *[_type in ["siteSettings", "pageSettings"]] | order(_updatedAt desc)[0]._updatedAt
        }
      }`,
    )
    .catch(() => ({ dynamic: [], updated: {} }));
  const prefix = { service: "services", event: "events", news: "news" };

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: data.updated?.[route.key],
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...(data.dynamic || []).map((entry) => ({
      url: `${SITE_URL}/${prefix[entry._type]}/${entry.slug}`,
      lastModified: entry._updatedAt,
      changeFrequency: entry._type === "news" ? "weekly" : "monthly",
      priority: entry._type === "service" ? 0.8 : 0.7,
    })),
  ];
}
