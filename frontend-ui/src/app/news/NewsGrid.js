"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { urlFor } from "@/sanityClient";
export default function NewsGrid({ articles }) {
  const [category, setCategory] = useState("all");
  const [visible, setVisible] = useState(12);
  const cats = useMemo(
    () => ["all", ...new Set(articles.map((x) => x.category).filter(Boolean))],
    [articles],
  );
  const filtered =
    category === "all"
      ? articles
      : articles.filter((x) => x.category === category);
  return (
    <div className="mt-14">
      <div className="flex flex-wrap gap-2">
        {cats.map((x) => (
          <button
            key={x}
            onClick={() => {
              setCategory(x);
              setVisible(12);
            }}
            className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize ${category === x ? "border-clay bg-clay text-ivory" : "border-forest/15 text-forest"}`}
          >
            {x.replace("-", " ")}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, visible).map((a) => {
          const image = urlFor(a.coverImage)
            ?.width(800)
            .height(520)
            .fit("crop")
            .url();
          return (
            <Link
              key={a._id}
              href={`/news/${a.slug?.current}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sage">
                {image && (
                  <Image
                    src={image}
                    alt={a.coverImage?.alt || a.headline}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="eyebrow mt-5 text-clay">
                {a.category || "Update"} ·{" "}
                {a.publishedAt
                  ? new Date(a.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-forest">
                {a.headline}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-carbon/60">
                {a.excerpt}
              </p>
              <span className="text-link mt-5 inline-flex">
                Read story <span>↗</span>
              </span>
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
