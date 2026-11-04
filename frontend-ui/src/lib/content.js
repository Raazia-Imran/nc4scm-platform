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
    const navigation = (content.navigation || []).map(item => item.href === "/legacy" ? {...item, label: "Centre Archive"} : item);
    if (!navigation.some(item => item.href === "/legacy")) {
      const index = navigation.findIndex(item => item.href === "/contact");
      navigation.splice(index < 0 ? navigation.length : index, 0, {label:"Centre Archive",href:"/legacy"});
    }
    return { ...content, navigation, interfaceText: { ...interfaceDefaults, ...content.interfaceText } };
  },
);
