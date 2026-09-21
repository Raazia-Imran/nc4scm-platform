// src/app/news/[slug]/page.js
// -----------------------------------------------------------------------------
// The dynamic route template for a single news article. The `[slug]` folder
// name tells Next.js's App Router to treat this as a dynamic segment —
// visiting /news/annual-conference-recap renders this file with
// `params.slug === "annual-conference-recap"`.
//
// `generateStaticParams` pre-builds every known article at build time (Static
// Site Generation), so published articles are served as pre-rendered HTML
// with no per-request database round trip. Any article created *after* the
// last build is still handled gracefully by Next.js's on-demand fallback
// rendering, then cached for subsequent visitors.
// -----------------------------------------------------------------------------
import Image from "next/image";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import JsonLd from "@/app/components/JsonLd";
import {
  buildMetadata,
  ORGANIZATION_NAME,
  SITE_URL,
  sanityImageUrl,
} from "@/lib/seo";

const ARTICLE_BY_SLUG_QUERY = `*[_type == "news" && slug.current == $slug][0]{
  _id, _updatedAt, headline, slug, excerpt, category, publishedAt, coverImage, body
}`;

const ALL_SLUGS_QUERY = `*[_type == "news" && defined(slug.current)]{ "slug": slug.current }`;

// Pre-renders a static page for every article slug that exists at build
// time. This is what enables true static generation for the dynamic route.
export async function generateStaticParams() {
  const slugs = await client.fetch(ALL_SLUGS_QUERY);
  return (slugs || []).map(({ slug }) => ({ slug }));
}

// Dynamic per-page metadata (browser tab title) based on the fetched article.
export async function generateMetadata({ params }) {
  const article = await client
    .fetch(ARTICLE_BY_SLUG_QUERY, { slug: params.slug })
    .catch(() => null);
  if (!article) {
    return buildMetadata({
      title: "News Article Not Found",
      path: `/news/${params.slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: article.headline,
    description: article.excerpt,
    path: `/news/${article.slug.current}`,
    image: article.coverImage,
    imageAlt: article.coverImage?.alt || article.headline,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article._updatedAt,
    keywords: [article.category, "NC4SCM news"].filter(Boolean),
  });
}

export default async function NewsArticlePage({ params }) {
  const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, {
    slug: params.slug,
  });

  // If no document matches this slug (e.g. a stale/incorrect link), render
  // Next.js's built-in 404 page rather than crashing or showing a blank
  // screen. This is the null-check that protects the entire route.
  if (!article) {
    notFound();
  }

  const coverImageUrl = urlFor(article.coverImage)
    ?.width(1600)
    .height(900)
    .url();
  const canonical = `${SITE_URL}/news/${article.slug.current}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${canonical}/#article`,
    headline: article.headline,
    description: article.excerpt,
    url: canonical,
    mainEntityOfPage: canonical,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    image: sanityImageUrl(article.coverImage),
    author: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    articleSection: article.category,
    inLanguage: "en-PK",
  };

  return (
    <article className="mx-auto max-w-content px-6 py-24 md:px-10">
      <JsonLd data={articleJsonLd} />
      <p className="text-xs uppercase tracking-widest text-stone">
        {article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink">
        {article.headline}
      </h1>

      {coverImageUrl && (
        <div className="relative mt-10 h-64 w-full overflow-hidden bg-stone/10 md:h-[28rem]">
          <Image
            src={coverImageUrl}
            alt={article.coverImage?.alt || article.headline}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="mx-auto mt-12 max-w-2xl text-base text-ink/90">
        <RichTextRenderer value={article.body} />
      </div>
    </article>
  );
}
