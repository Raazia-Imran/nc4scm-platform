"use client";

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
import { useMemo, useState } from "react";
import FilterMenu from "@/app/components/FilterMenu";

const CATEGORY_LABELS = {
  "lc3-technology": "LC3 Technology",
  "material-characterization": "Material Characterization",
  "new-material-development": "New Material Development",
  "technological-support": "Technological Support",
  "general-research": "General Research",
};

const PUBLICATION_TYPE_LABELS = {
  "journal-article": "Journal article",
  "conference-paper": "Conference paper",
  "book-chapter": "Book chapter",
  "technical-report": "Technical report",
};

// Supports both the current citation-name strings and resolved author objects
// returned by the earlier schema while existing records are being migrated.
const getAuthorName = (author) =>
  typeof author === "string" ? author : author?.fullName;

const getPublicationYear = (publication) =>
  String(
    publication.publicationYear || publication.releaseDate?.slice(0, 4) || "",
  );

export default function PublicationsVault({ publications }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("newest-year");

  // useMemo avoids re-filtering the full list on every unrelated re-render;
  // it only recomputes when the search term, category, or source data
  // actually changes.
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesCategory =
        activeCategory === "all" || pub.category === activeCategory;
      const haystack = [
        pub.title,
        pub.abstract,
        pub.journal,
        pub.keywords?.join(" "),
        pub.authors?.map(getAuthorName).filter(Boolean).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesYear =
        year === "all" || getPublicationYear(pub) === String(year);
      return matchesCategory && matchesSearch && matchesYear;
    }).sort((a, b) => {
      if (sort === "recently-added") return new Date(b._createdAt || 0) - new Date(a._createdAt || 0);
      if (sort === "oldest-year") return Number(getPublicationYear(a)) - Number(getPublicationYear(b));
      return Number(getPublicationYear(b)) - Number(getPublicationYear(a));
    });
  }, [publications, searchTerm, activeCategory, year, sort]);
  const years = [
    ...new Set(publications.map(getPublicationYear).filter(Boolean)),
  ].sort((a, b) => Number(b) - Number(a));
  const yearOptions = [
    { value: "all", label: "All years" },
    ...years.map((item) => ({ value: item, label: item })),
  ];
  const sortOptions = [
    { value: "newest-year", label: "Newest research" },
    { value: "recently-added", label: "Recently added" },
    { value: "oldest-year", label: "Oldest research" },
  ];

  // Build the list of categories that actually have at least one
  // publication, so the filter bar never shows an empty, dead-end option.
  const availableCategories = useMemo(() => {
    const set = new Set(
      publications.map((pub) => pub.category).filter(Boolean),
    );
    return Array.from(set);
  }, [publications]);
  const categoryOptions = [
    { value: "all", label: "All research topics" },
    ...availableCategories.map((category) => ({
      value: category,
      label: CATEGORY_LABELS[category] || category,
    })),
  ];

  return (
    <div className="mt-14">
      {/* --------------------------------------------------------------
          SEARCH + FILTER CONTROLS
      -------------------------------------------------------------- */}
      <div className="research-filter-panel">
        <label className="research-search-field">
          <span className="sr-only">Search publications</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title, author, or venue…"
            className="field-input mt-0 w-full"
          />
        </label>
        <FilterMenu label="Filter by year" value={year} options={yearOptions} onChange={setYear} />
        <FilterMenu label="Filter by research topic" value={activeCategory} options={categoryOptions} onChange={setActiveCategory} />
        <FilterMenu label="Sort publications" value={sort} options={sortOptions} onChange={setSort} />
      </div>

      {/* --------------------------------------------------------------
          RESULTS LIST
      -------------------------------------------------------------- */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub) => (
            <article
              key={pub._id}
              className="premium-card grid min-w-0 gap-6 overflow-hidden p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-accent">
                  {CATEGORY_LABELS[pub.category] || pub.category}
                  {pub.publicationType && (
                    <>
                      <span aria-hidden="true"> · </span>
                      {PUBLICATION_TYPE_LABELS[pub.publicationType] ||
                        pub.publicationType}
                    </>
                  )}
                </p>
                <h2 className="mt-3 max-w-3xl break-words font-sans text-[clamp(1.25rem,4.5vw,1.5rem)] font-semibold leading-tight tracking-[-.035em] text-forest">
                  {pub.title}
                </h2>
                <p className="mt-2 text-sm text-stone">
                  {pub.authors && pub.authors.length > 0
                    ? pub.authors
                        .map(getAuthorName)
                        .filter(Boolean)
                        .join(", ")
                    : "Unattributed"}
                  {pub.releaseDate
                    ? ` — ${new Date(`${pub.releaseDate}T00:00:00`).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}`
                    : getPublicationYear(pub) &&
                      ` — ${getPublicationYear(pub)}`}
                </p>
                {pub.journal && (
                  <p className="mt-2 text-sm font-semibold text-carbon/70">
                    {pub.journal}
                    {pub.publisher && ` · ${pub.publisher}`}
                  </p>
                )}
                {pub.abstract && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80">
                    {pub.abstract}
                  </p>
                )}
                {pub.keywords?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pub.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-sage px-3 py-1 text-xs text-forest"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
                {pub.doiUrl && (
                  <a
                    href={pub.doiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link mt-5 inline-flex"
                  >
                    View DOI <span>↗</span>
                  </a>
                )}
              </div>
              {/* The PDF download link is a direct, secure Sanity CDN asset
                  URL — resolved server-side via `pdfFile.asset->url` in the
                  GROQ query — so no proxying or extra backend code is
                  needed to serve the file. */}
              {pub.pdfUrl && (
                <a
                  href={pub.pdfUrl}
                  download={pub.pdfFilename || true}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block whitespace-nowrap self-start border border-ink px-5 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                >
                  Download PDF
                </a>
              )}
            </article>
          ))
        ) : (
          <p className="py-8 text-sm text-stone">
            No publications match your search.
          </p>
        )}
      </div>
    </div>
  );
}
