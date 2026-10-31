import imageUrlBuilder from "@sanity/image-url";
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
});

/**
 * Safely builds an image URL from a Sanity image reference object.
 * Returns `null` instead of throwing when `source` is missing/null so every
 * calling component can do a simple `{url && <img src={url} />}` check
 * rather than needing its own try/catch.
 */
export function urlFor(source) {
  // Empty Studio image objects would otherwise throw later at .url().
  const ref =
    typeof source === "string" ? source : source?.asset?._ref || source?._ref;
  if (!ref || !/^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/.test(ref))
    return null;
  return builder.image(source);
}
