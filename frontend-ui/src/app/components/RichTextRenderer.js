// src/app/components/RichTextRenderer.js
// -----------------------------------------------------------------------------
// Sanity stores rich text as "Portable Text" — a JSON array describing
// blocks (paragraphs, headings, lists) and marks (bold, italic, links)
// rather than raw HTML. This keeps content storage portable across any
// frontend (web, mobile, print) but means we need a renderer to turn that
// JSON back into real markup on this specific frontend.
//
// @portabletext/react's <PortableText> component walks that JSON tree and
// calls the matching function in our `components` map for each node type it
// encounters. Anything we don't override falls back to sane defaults, but
// we override every block/mark type we actually use so the typography
// matches the site's quiet-luxury aesthetic exactly.
// -----------------------------------------------------------------------------
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanityClient";

const components = {
  block: {
    // Standard paragraph text.
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-display text-2xl text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-display text-xl text-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent pl-6 italic text-stone">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      // External links open in a new tab; `rel="noopener noreferrer"`
      // prevents the new page from gaining access to `window.opener`,
      // a standard security precaution for user-authored external links.
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-accent underline underline-offset-4 hover:text-ink"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    // Inline images embedded in a rich-text body (used by the news schema).
    image: ({ value }) => {
      const imageUrl = urlFor(value)?.ignoreImageParams().width(1200).fit("max").url();
      if (!imageUrl) return null;
      const dimensions = value.asset?._ref?.match(/-(\d+)x(\d+)-[a-zA-Z0-9]+$/);
      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={Number(dimensions?.[1]) || 1200}
            height={Number(dimensions?.[2]) || 800}
            sizes="(max-width: 767px) 90vw, 720px"
            className="h-auto w-full rounded-xl object-contain"
          />
          {value.caption && <figcaption className="mt-3 text-sm leading-6 text-carbon/70">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

export default function RichTextRenderer({ value }) {
  // Guard against empty/undefined rich-text fields so this component can
  // always be rendered unconditionally by its callers.
  if (typeof value === "string")
    return <p className="whitespace-pre-line leading-relaxed">{value}</p>;
  if (!Array.isArray(value)) return null;
  const valid = value
    .filter(
      (block) =>
        block &&
        typeof block === "object" &&
        (block._type === "image" ||
          (block._type === "block" && Array.isArray(block.children))),
    )
    .map((block) =>
      block._type !== "block"
        ? block
        : {
            ...block,
            children: block.children.filter(
              (child) => child && typeof child.text === "string",
            ),
          },
    );
  if (!valid.length) return null;
  return <PortableText value={valid} components={components} />;
}
