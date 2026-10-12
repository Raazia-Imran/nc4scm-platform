"use client";
import { useContent } from "@/app/components/ContentProvider";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { urlFor } from "@/sanityClient";
import NewsCategoryFilter from "./NewsCategoryFilter";
export default function NewsGrid({ articles }) {
  const text = useContent();
  const categoryKeys = {
    recognition: "recognition",
    "industry-engagement": "industryEngagement",
    "global-engagement": "globalEngagement",
    milestone: "milestone",
    research: "research",
    "policy-engagement": "policyEngagement",
    "public-engagement": "publicEngagement",
  };
  const [category, setCategory] = useState("all");
  const [visible, setVisible] = useState(12);
  const cats = useMemo(
    () => ["all", ...new Set(articles.map((x) => x.category).filter(Boolean))],
    [articles],
  );
  const filtered = articles.filter(
    (x) => category === "all" || x.category === category,
  );
  const options = cats.map((x) => ({
    value: x,
    label:
      x === "all"
        ? text.allNews
        : text[categoryKeys[x]] || x.replaceAll("-", " "),
  }));
  return (
    <div className="mt-2">
      <NewsCategoryFilter
        value={category}
        options={options}
        onChange={(next) => {
          setCategory(next);
          setVisible(12);
        }}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, visible).map((a) => {
          const image =
            a.coverImage &&
            urlFor(a.coverImage)?.width(800).height(520).fit("crop").url();
          const href = a.slug?.current ? `/news/${a.slug.current}` : "/news";
          return (
            <Link
              key={a._id}
              href={href}
              className="premium-card news-card group p-3 pb-5"
            >
              <div className="news-card-photo relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-sage">
                {image && (
                  <Image
                    src={image}
                    alt={a.coverImage?.alt || a.headline}
                    fill
                    sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 30vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="px-3">
                <p className="eyebrow mt-5 text-clay">
                  {text[categoryKeys[a.category]] ||
                    a.category?.replaceAll("-", " ")}{" "}
                  ·{" "}
                  {a.publishedAt
                    ? new Date(a.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
                <h2 className="mt-3 font-sans text-xl font-semibold leading-tight tracking-[-.035em] text-forest">
                  {a.headline}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-carbon/60">
                  {a.excerpt}
                </p>
                <span className="text-link mt-5 inline-flex">
                  {text.readStory}{" "}
                  <span>↗</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {!filtered.length && (
        <p role="status" className="py-10 text-carbon/65">
          {text.noNews}
        </p>
      )}
      {visible < filtered.length && (
        <div className="mt-14 text-center">
          <button
            onClick={() => setVisible((v) => v + 12)}
            className="button button-dark"
          >
            {text.loadMore} <span>↓</span>
          </button>
        </div>
      )}
    </div>
  );
}
