import { cache } from "react";
import { client } from "@/sanityClient";

export const getSiteContent = cache(
  async () =>
    (await client
      .fetch(
        '*[_type == "siteSettings"][0]{..., "resolvedServiceLinks": *[_type == "service" && defined(slug.current)] | order(displayOrder asc) {"label": title, "href": "/services/" + slug.current}}',
      )
      .catch(() => null)) || {},
);
