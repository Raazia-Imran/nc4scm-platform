"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { urlFor } from "@/sanityClient";
import FilterIcon from "@/app/components/FilterIcon";
export default function NewsGrid({ articles }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(12);
  const cats = useMemo(
    () => ["all", ...new Set(articles.map((x) => x.category).filter(Boolean))],
    [articles],
  );
  const filtered = articles.filter((x) => (category === "all" || x.category === category) && [x.headline, x.excerpt, x.category].join(" ").toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="mt-14">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="relative"><span className="sr-only">Search news</span><input value={search} onChange={(e) => setSearch(e.target.value)} className="field-input mt-0 w-full" placeholder="Search news and updates…" /></label>
        <button className="button button-dark sm:hidden" onClick={() => setFiltersOpen(true)}><FilterIcon /> Filter news</button>
      </div>
      <div className="filter-rail mt-5 hidden sm:flex" aria-label="Filter news by category">
        <span className="filter-rail-label"><FilterIcon /> Filter</span>
        {cats.map((x) => <button key={x} onClick={() => { setCategory(x); setVisible(12); }} className={`filter-pill ${category === x ? "is-active" : ""}`}>{x === "all" ? "All news" : x.replaceAll("-", " ")}</button>)}
      </div>
      {filtersOpen && <div className="filter-drawer-backdrop" role="presentation" onClick={() => setFiltersOpen(false)}><aside className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filter news" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-forest">Filter news</h2><button className="grid h-10 w-10 place-items-center rounded-full border border-forest/15" onClick={() => setFiltersOpen(false)} aria-label="Close filters">×</button></div><div className="mt-7 grid gap-2">{cats.map((x) => <button key={x} onClick={() => { setCategory(x); setVisible(12); setFiltersOpen(false); }} className={`filter-drawer-option ${category === x ? "is-active" : ""}`}>{x === "all" ? "All news" : x.replaceAll("-", " ")}</button>)}</div></aside></div>}
      <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, visible).map((a) => {
          const image =
            (a.coverImage &&
              urlFor(a.coverImage)?.width(800).height(520).fit("crop").url()) ||
            a.localImage;
          const href =
            a.externalUrl ||
            (a.slug?.current ? `/news/${a.slug.current}` : "/news");
          return (
            <Link
              key={a._id}
              href={href}
              target={a.externalUrl ? "_blank" : undefined}
              rel={a.externalUrl ? "noreferrer" : undefined}
              className="premium-card group p-3 pb-7"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sage">
                {image && (
                  <Image
                    src={image}
                    alt={a.coverImage?.alt || a.headline}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="px-3">
              <p className="eyebrow mt-5 text-clay">
                {a.category || "Update"} ·{" "}
                {a.publishedAt
                  ? new Date(a.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </p>
              <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-[-.035em] text-forest">
                {a.headline}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-carbon/60">
                {a.excerpt}
              </p>
              <span className="text-link mt-5 inline-flex">
                {a.externalUrl ? "View original update" : "Read story"}{" "}
                <span>↗</span>
              </span>
              </div>
            </Link>
          );
        })}
      </div>
      {visible < filtered.length && (
        <div className="mt-14 text-center">
          <button
            onClick={() => setVisible((v) => v + 12)}
            className="button button-dark"
          >
            Load more <span>↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
