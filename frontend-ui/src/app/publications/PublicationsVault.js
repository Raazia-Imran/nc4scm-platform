'use client'

// src/app/publications/PublicationsVault.js
// -----------------------------------------------------------------------------
// "use client" marks this as a Client Component — it ships JavaScript to the
// browser and can use React hooks like useState/useMemo. This is necessary
// (and the ONLY necessary place) for the publications page, because
// filtering-as-you-type is inherently an interactive, client-side behavior.
//
// The data itself was already fetched server-side in page.js and is passed
// in as the `publications` prop, so this component does zero network
// requests of its own — it only filters the array that's already in memory.
// -----------------------------------------------------------------------------
import {useMemo, useState} from 'react'

const CATEGORY_LABELS = {
  'lc3-technology': 'LC3 Technology',
  'material-characterization': 'Material Characterization',
  'new-material-development': 'New Material Development',
  'technological-support': 'Technological Support',
  'general-research': 'General Research',
}

export default function PublicationsVault({publications}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // useMemo avoids re-filtering the full list on every unrelated re-render;
  // it only recomputes when the search term, category, or source data
  // actually changes.
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesCategory = activeCategory === 'all' || pub.category === activeCategory
      const matchesSearch = pub.title?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [publications, searchTerm, activeCategory])

  // Build the list of categories that actually have at least one
  // publication, so the filter bar never shows an empty, dead-end option.
  const availableCategories = useMemo(() => {
    const set = new Set(publications.map((pub) => pub.category).filter(Boolean))
    return Array.from(set)
  }, [publications])

  return (
    <div className="mt-14">
      {/* --------------------------------------------------------------
          SEARCH + FILTER CONTROLS
      -------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 border-b border-stone/30 pb-6 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search publications by title…"
          className="w-full max-w-sm border border-stone/40 bg-transparent px-4 py-2 text-sm placeholder:text-stone/60 focus:border-ink focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 text-xs uppercase tracking-widest ${
              activeCategory === 'all' ? 'bg-ink text-paper' : 'text-stone hover:text-ink'
            }`}
          >
            All
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 text-xs uppercase tracking-widest ${
                activeCategory === category ? 'bg-ink text-paper' : 'text-stone hover:text-ink'
              }`}
            >
              {CATEGORY_LABELS[category] || category}
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------
          RESULTS LIST
      -------------------------------------------------------------- */}
      <div className="mt-10 divide-y divide-stone/20">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub) => (
            <article key={pub._id} className="grid gap-3 py-8 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent">
                  {CATEGORY_LABELS[pub.category] || pub.category}
                </p>
                <h2 className="mt-2 font-display text-xl text-ink">{pub.title}</h2>
                <p className="mt-2 text-sm text-stone">
                  {pub.authors && pub.authors.length > 0
                    ? pub.authors.map((author) => author.fullName).join(', ')
                    : 'Unattributed'}
                  {pub.releaseDate &&
                    ` — ${new Date(pub.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}`}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80">{pub.abstract}</p>
              </div>
              {/* The PDF download link is a direct, secure Sanity CDN asset
                  URL — resolved server-side via `pdfFile.asset->url` in the
                  GROQ query — so no proxying or extra backend code is
                  needed to serve the file. */}
              {pub.pdfUrl ? (
                <a
                  href={pub.pdfUrl}
                  download={pub.pdfFilename || true}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block whitespace-nowrap self-start border border-ink px-5 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                >
                  Download PDF
                </a>
              ) : (
                <span className="text-xs text-stone">No file attached</span>
              )}
            </article>
          ))
        ) : (
          <p className="py-8 text-sm text-stone">No publications match your search.</p>
        )}
      </div>
    </div>
  )
}
