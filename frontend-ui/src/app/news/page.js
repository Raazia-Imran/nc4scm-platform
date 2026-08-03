// src/app/news/page.js
// -----------------------------------------------------------------------------
// The News Bulletin index — a full chronological list of every news
// article, each one linking into the dynamic [slug] route for the full
// article view. This complements news/[slug]/page.js, which was explicitly
// requested in the sitemap; a list page is needed for that dynamic route to
// actually be discoverable from the site navigation.
// -----------------------------------------------------------------------------
import Image from 'next/image'
import Link from 'next/link'
import {client, urlFor} from '@/sanityClient'

const ALL_NEWS_QUERY = `*[_type == "news"] | order(publishedAt desc){
  _id, headline, slug, publishedAt, coverImage
}`

export const metadata = {
  title: 'News — NC4SCM',
}

export default async function NewsIndexPage() {
  const articles = await client.fetch(ALL_NEWS_QUERY)

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10">
      <h1 className="font-display text-4xl leading-tight text-ink">News Bulletin</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
        Announcements, milestones, and updates from across NC4SCM.
      </p>

      <div className="mt-16 divide-y divide-stone/20">
        {articles && articles.length > 0 ? (
          articles.map((article) => {
            const imageUrl = urlFor(article.coverImage)?.width(300).height(200).url()
            return (
              <Link
                key={article._id}
                href={`/news/${article.slug?.current}`}
                className="group flex flex-col gap-6 py-8 sm:flex-row sm:items-center"
              >
                {imageUrl && (
                  <div className="relative h-32 w-full flex-shrink-0 overflow-hidden bg-stone/10 sm:w-52">
                    <Image
                      src={imageUrl}
                      alt={article.coverImage?.alt || article.headline}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </p>
                  <h2 className="mt-2 font-display text-xl text-ink group-hover:underline">
                    {article.headline}
                  </h2>
                </div>
              </Link>
            )
          })
        ) : (
          <p className="py-8 text-sm text-stone">No news articles have been published yet.</p>
        )}
      </div>
    </section>
  )
}
