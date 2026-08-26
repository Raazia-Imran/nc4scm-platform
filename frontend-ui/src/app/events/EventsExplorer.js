"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import FilterIcon from "@/app/components/FilterIcon";
const labels = {
  conference: "Conference",
  seminar: "Seminar",
  workshop: "Workshop",
};
export default function EventsExplorer({ events }) {
  const [period, setPeriod] = useState("upcoming");
  const [type, setType] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const now = Date.now();
  const shown = useMemo(
    () =>
      events
        .filter(
          (e) =>
            (period === "upcoming"
              ? new Date(e.eventDateTime).getTime() >= now
              : new Date(e.eventDateTime).getTime() < now) &&
            (type === "all" || e.eventType === type),
        )
        .sort((a, b) =>
          period === "upcoming"
            ? new Date(a.eventDateTime) - new Date(b.eventDateTime)
            : new Date(b.eventDateTime) - new Date(a.eventDateTime),
        ),
    [events, period, type, now],
  );
  return (
    <div className="mt-14">
      <div className="flex flex-col gap-5 border-b border-forest/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full bg-sage p-1">
          {["upcoming", "past"].map((x) => (
            <button
              key={x}
              onClick={() => setPeriod(x)}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${period === x ? "bg-forest text-ivory" : "text-forest"}`}
            >
              {x}
            </button>
          ))}
        </div>
        <button className="button button-dark sm:hidden" onClick={() => setFiltersOpen(true)}><FilterIcon /> Filter events</button>
        <div className="filter-rail hidden sm:flex sm:max-w-[34rem]" aria-label="Filter events by type">
          <span className="filter-rail-label"><FilterIcon /> Type</span>
          {["all", "conference", "seminar", "workshop"].map((x) => <button key={x} onClick={() => setType(x)} className={`filter-pill ${type === x ? "is-active" : ""}`}>{x === "all" ? "All" : `${x}s`}</button>)}
        </div>
      </div>
      {filtersOpen && <div className="filter-drawer-backdrop" role="presentation" onClick={() => setFiltersOpen(false)}><aside className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filter events" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-forest">Filter events</h2><button className="grid h-10 w-10 place-items-center rounded-full border border-forest/15" onClick={() => setFiltersOpen(false)} aria-label="Close filters">×</button></div><div className="mt-7 grid gap-2">{["all", "conference", "seminar", "workshop"].map((x) => <button key={x} onClick={() => { setType(x); setFiltersOpen(false); }} className={`filter-drawer-option ${type === x ? "is-active" : ""}`}>{x === "all" ? "All event types" : `${x}s`}</button>)}</div></aside></div>}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {shown.length ? (
          shown.map((e) => {
            const d = new Date(e.eventDateTime);
            return (
              <Link
                key={e._id}
                href={
                  e.externalUrl ||
                  (e.slug?.current ? `/events/${e.slug.current}` : "/events")
                }
                target={e.externalUrl ? "_blank" : undefined}
                rel={e.externalUrl ? "noreferrer" : undefined}
                className="premium-card group grid min-h-[23rem] overflow-hidden p-3 sm:grid-cols-[8.5rem_1fr]"
              >
                <div className="flex flex-col justify-between rounded-[1.25rem] bg-forest p-5 text-ivory">
                  <div>
                  <p className="font-sans text-5xl font-medium tracking-[-.05em]">
                    {String(d.getDate()).padStart(2, "0")}
                  </p>
                  <p className="eyebrow mt-1 text-mint">
                    {d.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/25 transition group-hover:rotate-45 group-hover:bg-ivory group-hover:text-forest">↗</span>
                </div>
                <div className="flex min-w-0 flex-col p-4 sm:p-5">
                <div className="relative mb-5 aspect-[16/8] overflow-hidden rounded-xl bg-sage">
                  {e.localImage && (
                    <Image
                      src={e.localImage}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 70vw, 38vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div>
                  <p className="eyebrow text-clay">
                    {labels[e.eventType] || e.eventType}
                  </p>
                  <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-[-.035em] text-forest">
                    {e.title}
                  </h2>
                  <p className="mt-3 text-sm text-carbon/55">{e.venue}</p>
                  {e.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-carbon/55">
                      {e.description}
                    </p>
                  )}
                </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-2xl bg-sage p-10 text-center text-carbon/60 lg:col-span-2">
            No {period} {type === "all" ? "events" : `${type} events`} are
            published yet.
          </div>
        )}
      </div>
    </div>
  );
}
