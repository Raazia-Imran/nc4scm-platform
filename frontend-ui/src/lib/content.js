import { cache } from "react";
import { client } from "@/sanityClient";

export const getSiteContent = cache(
  async () =>
    (await client.fetch('*[_type == "siteSettings"][0]').catch(() => null)) ||
    {},
);
