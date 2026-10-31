import { pageMetadata } from "@/lib/page-metadata";
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
import ContentImage from "@/app/components/ContentImage";
import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanityClient";
import RichTextRenderer from "@/app/components/RichTextRenderer";
import EventGallery from "@/app/components/EventGallery";

export const revalidate = 60;

const ARTICLE_BY_SLUG_QUERY = `*[_type == "news" && slug.current == $slug][0]{
  _id, headline, excerpt, externalUrl, publishedAt, coverImage, body, gallery
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
  params = await params;
  const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, {
    slug: params.slug,
  });
  return pageMetadata({
    title: article?.headline,
    description: article?.excerpt,
    alternates: { canonical: `/news/${params.slug}` },
  });
}

export default async function NewsArticlePage({ params }) {
  params = await params;
  const [article, site] = await Promise.all([
    client.fetch(ARTICLE_BY_SLUG_QUERY, { slug: params.slug }),
    getSiteContent(),
  ]);
  const text = site.interfaceText || {};

  // If no document matches this slug (e.g. a stale/incorrect link), render
  // Next.js's built-in 404 page rather than crashing or showing a blank
  // screen. This is the null-check that protects the entire route.
  if (!article) {
    notFound();
  }

  const gallery = (article.gallery || []).map((item, index) => ({
    key: item._key || String(index),
    src: urlFor(item)?.ignoreImageParams().width(1400).fit("max").url(),
    alt: item.alt || article.headline,
    caption: item.caption,
  })).filter((item) => item.src);

  return (
    <>
    <article className="news-article mx-auto max-w-content px-5 pb-12 pt-36 md:px-10">
      <Link href="/news" className="eyebrow text-clay">
        ← {text.allNews}
      </Link>
      <p className="mt-8 text-xs uppercase tracking-widest text-stone">
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

      <ContentImage image={article.coverImage} fallbackAlt={article.headline} viewLabel={text.viewFullImage} priority className="mt-10" />

      <div className="mx-auto mt-12 max-w-2xl text-base text-ink/90">
        {!article.body?.length && article.excerpt && (
          <p className="mb-8 text-lg leading-8">{article.excerpt}</p>
        )}
        <RichTextRenderer value={article.body} />
        {gallery.length > 0 && <section className="mt-10" aria-label={text.articlePhotos}>
          <h2 className="mb-5 text-xl font-semibold text-forest">{text.articlePhotos}</h2>
          <EventGallery images={gallery} text={text} label={text.articlePhotos} />
        </section>}
        {article.externalUrl && (
          <a
            href={article.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link mt-6 inline-flex"
          >
            {text.viewOriginal}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
    <nav className="detail-return-bar"><Link href="/news" className="detail-return">← {text.allNews}</Link></nav>
    </>
  );
}
