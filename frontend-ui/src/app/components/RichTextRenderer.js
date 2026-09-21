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
      const imageUrl = urlFor(value)?.width(1200).url();
      if (!imageUrl) return null;
      return (
        <span className="my-8 block">
          <Image
            src={imageUrl}
            alt={value.alt || "NC4SCM article illustration"}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
        </span>
      );
    },
  },
};

export default function RichTextRenderer({ value }) {
  // Guard against empty/undefined rich-text fields so this component can
  // always be rendered unconditionally by its callers.
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
