import { cache } from "react";
import interfaceDefaults from "../../../cms-backend/seed/interface-text.json";
import { client } from "@/sanityClient";

export const getSiteContent = cache(
  async () => {
    const content = (await client
      .fetch(
        '*[_type == "siteSettings"][0]{..., "resolvedServiceLinks": *[_type == "service" && defined(slug.current)] | order(displayOrder asc) {"label": title, "href": "/services/" + slug.current}}',
      )
      .catch(() => null)) || {};
    // Shared Studio defaults keep controls usable before a new CMS field is saved.
    // Explicit editor values, including empty strings, always take precedence.
    return { ...content, interfaceText: { ...interfaceDefaults, ...content.interfaceText } };
  },
);
