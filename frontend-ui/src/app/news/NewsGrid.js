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
