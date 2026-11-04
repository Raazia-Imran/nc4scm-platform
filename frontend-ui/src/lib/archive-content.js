import { urlFor } from "@/lib/image-url";
export function photosFor(items = [], title = "") {
  return items.flatMap((item, index) => {
    const src = urlFor(item)
      ?.ignoreImageParams()
      .width(1600)
      .fit("max")
      .auto("format")
      .url();
    return src
      ? [
          {
            src,
            alt: item.alt || title,
            caption: item.caption || item.alt || title,
            credit: item.credit || "",
            key: item._key || `${index}-${src}`,
          },
        ]
      : [];
  });
}
export function timelineGroups(journey = [], events = [], news = []) {
  const groups = new Map();
  for (const item of journey) {
    const year = String(item.year || "");
    if (!year) continue;
    const group = groups.get(year) || {
      year,
      title: item.title,
      description: item.description,
      photos: [],
      links: [],
    };
    group.photos.push(...photosFor(item.photos, item.title));
    groups.set(year, group);
  }
  for (const item of [...events, ...news]) {
    const date = item.eventDateTime || item.publishedAt;
    if (!date || !Number.isFinite(Date.parse(date)) || Date.parse(date) > Date.now()) continue;
    const year = new Date(date).toLocaleDateString("en-CA", {
      year: "numeric",
      timeZone: "Asia/Karachi",
    });
    const title = item.title || item.headline;
    const group = groups.get(year) || {
      year,
      title: "A year of research and exchange",
      description: "Published moments from the centre’s events and news.",
      photos: [],
      links: [],
    };
    group.photos.push(
      ...photosFor(
        [
          ...(item.coverImage ? [item.coverImage] : []),
          ...(item.gallery || []),
        ],
        title,
      ),
    );
    if (item.slug?.current)
      group.links.push({
        title,
        href: `/${item._type === "event" ? "events" : "news"}/${item.slug.current}`,
      });
    groups.set(year, group);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      photos: group.photos.filter(
        (p, i, all) => all.findIndex((x) => x.src === p.src) === i,
      ),
    }))
    .sort((a, b) => b.year.localeCompare(a.year, undefined, { numeric: true }));
}
