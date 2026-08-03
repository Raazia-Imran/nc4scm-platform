// src/app/page.js
// -----------------------------------------------------------------------------
// The landing page. This is an async Server Component — Next.js App Router
// allows page components to be `async function`s that fetch their own data
// directly on the server before rendering, with zero client-side loading
// spinners needed for this content.
//
// DATA FLOW: two independent GROQ queries run in parallel via Promise.all
// (services + latest news), then the resulting arrays are mapped into JSX.
// -----------------------------------------------------------------------------
import Link from 'next/link'
import Image from 'next/image'
import {client, urlFor} from '@/sanityClient'

// GROQ query: fetch all services ordered by displayOrder, limited to the
// four cards the homepage overview grid needs.
const SERVICES_QUERY = `*[_type == "service"] | order(displayOrder asc)[0...3]{
  _id, title, slug, summary
}`

// GROQ query: fetch the 3 most recently published news articles.
const LATEST_NEWS_QUERY = `*[_type == "news"] | order(publishedAt desc)[0...3]{
  _id, headline, slug, publishedAt, coverImage
}`

export default async function HomePage() {
  // Running both queries concurrently (rather than one `await` after
  // another) roughly halves the time-to-first-byte for this page, since
  // neither query depends on the other's result.
  const [services, latestNews] = await Promise.all([
    client.fetch(SERVICES_QUERY),
    client.fetch(LATEST_NEWS_QUERY),
  ])

  return (
    <>
      {/* ------------------------------------------------------------------
          HERO
          Large serif slogan with generous vertical whitespace — the
          "expansive breathing room" the design brief calls for.
      ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-content px-6 py-28 md:px-10 md:py-40">
        <h1 className="font-display text-4xl leading-tight text-ink md:text-6xl">
          Building Tomorrow, Sustainably.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-stone md:text-lg">
          NC4SCM researches and develops the next generation of low-carbon
          construction materials, from LC3 cement technology to advanced
          material characterization.
        </p>
        <Link
          href="/services"
          className="mt-10 inline-block border border-ink px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
        >
          Explore Our Services
        </Link>
      </section>

      {/* ------------------------------------------------------------------
          SERVICE OVERVIEW GRID (3 columns on desktop)
      ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-content px-6 py-16 md:px-10">
        <h2 className="font-display text-2xl text-ink">What We Do</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {services && services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="border-t border-stone/30 pt-6">
                <h3 className="font-display text-xl text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{service.summary}</p>
              </div>
            ))
          ) : (
            // Null-safe fallback: if the Studio has no service documents
            // yet, we show a friendly placeholder instead of a broken grid.
            <p className="text-sm text-stone">
              Services will appear here once they are published in the Studio.
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          LATEST NEWS LIST
      ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-content px-6 py-16 md:px-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink">Latest News</h2>
          <Link href="/news" className="text-sm uppercase tracking-widest text-stone hover:text-ink">
            View All
          </Link>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {latestNews && latestNews.length > 0 ? (
            latestNews.map((article) => {
              const imageUrl = urlFor(article.coverImage)?.width(600).height(400).url()
              return (
                <Link key={article._id} href={`/news/${article.slug?.current}`} className="group block">
                  {imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-stone/10">
                      <Image
                        src={imageUrl}
                        alt={article.coverImage?.alt || article.headline}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <p className="mt-4 text-xs uppercase tracking-widest text-stone">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </p>
                  <h3 className="mt-2 font-display text-lg text-ink group-hover:underline">
                    {article.headline}
                  </h3>
                </Link>
              )
            })
          ) : (
            <p className="text-sm text-stone">No news articles have been published yet.</p>
          )}
        </div>
      </section>
    </>
  )
}
