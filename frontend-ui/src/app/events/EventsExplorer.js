"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
const labels = {
  conference: "Conference",
  seminar: "Seminar",
  workshop: "Workshop",
};
export default function EventsExplorer({ events }) {
  const [period, setPeriod] = useState("upcoming");
  const [type, setType] = useState("all");
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
        <div className="flex flex-wrap gap-2">
          {["all", "conference", "seminar", "workshop"].map((x) => (
            <button
              key={x}
              onClick={() => setType(x)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize ${type === x ? "border-clay bg-clay text-ivory" : "border-forest/15 text-forest"}`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <div>
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
                className="group grid gap-6 border-b border-forest/15 py-8 sm:grid-cols-[7rem_9rem_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="font-display text-5xl text-forest">
                    {String(d.getDate()).padStart(2, "0")}
                  </p>
                  <p className="eyebrow mt-1 text-clay">
                    {d.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-sage sm:block">
                  {e.localImage && (
                    <Image
                      src={e.localImage}
                      alt=""
                      fill
                      sizes="144px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div>
                  <p className="eyebrow text-clay">
                    {labels[e.eventType] || e.eventType}
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-forest">
                    {e.title}
                  </h2>
                  <p className="mt-3 text-sm text-carbon/55">{e.venue}</p>
                  {e.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-carbon/55">
                      {e.description}
                    </p>
                  )}
                </div>
                <span className="service-arrow">↗</span>
              </Link>
            );
          })
        ) : (
          <div className="rounded-2xl bg-sage p-10 text-center text-carbon/60">
            No {period} {type === "all" ? "events" : `${type} events`} are
            published yet.
          </div>
        )}
      </div>
    </div>
  );
}
