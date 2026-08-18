// src/sanityClient.js
// -----------------------------------------------------------------------------
// This module is the single source of truth for how the Next.js frontend
// talks to Sanity's Content API. Every page in this project imports `client`
// (to run GROQ queries) and `urlFor` (to turn a Sanity image reference into a
// real, optimized <img>-ready URL) from here instead of instantiating their
// own clients — that way, CDN behavior, API versioning, and auth all live in
// exactly one place.
//
// HOW DATA FLOWS:
//   Sanity Studio (editor writes content)
//     -> Sanity's hosted dataset
//     -> queried here via GROQ over Sanity's CDN (fast, cached, read-only)
//     -> returned as plain JSON to whichever Server Component called it
//     -> rendered into HTML on the server before it ever reaches the browser
//
// WHY THE CDN MATTERS:
// `useCdn: true` routes reads through Sanity's globally distributed,
// heavily-cached API tier. It is dramatically faster and cheaper than
// hitting the live API directly, and is the correct default for any content
// that doesn't need to reflect an edit within milliseconds (our news,
// events, publications, etc. are all fine with a short cache window).
// -----------------------------------------------------------------------------
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// Fail loudly and early if the project hasn't configured its environment
// variables yet, rather than silently returning empty data everywhere and
// leaving a beginner to debug a blank page with no explanation.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

if (!projectId || !dataset) {
  // We intentionally throw only in development so a misconfigured
  // production build doesn't crash for end-users; in production, Next.js
  // will still fail the build if these are missing, which is the safer
  // failure mode for a live site.
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET. " +
        "Copy .env.local and fill in your Sanity project details.",
    );
  }
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Only attached if a read token was actually provided (i.e. the dataset
  // is private). Public datasets work perfectly fine with `token: undefined`.
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  perspective: "published",
});

// imageUrlBuilder wraps our client and exposes a fluent API for generating
// resized/cropped/format-converted image URLs on the fly, e.g.
//   urlFor(doc.avatar).width(400).height(400).url()
const builder = imageUrlBuilder(client);

/**
 * Safely builds an image URL from a Sanity image reference object.
 * Returns `null` instead of throwing when `source` is missing/null so every
 * calling component can do a simple `{url && <img src={url} />}` check
 * rather than needing its own try/catch.
 */
export function urlFor(source) {
  if (!source) return null;
  return builder.image(source);
}
