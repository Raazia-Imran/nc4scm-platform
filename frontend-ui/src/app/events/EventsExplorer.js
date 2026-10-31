"use client";
import { useContent } from "@/app/components/ContentProvider";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import FilterMenu from "@/app/components/FilterMenu";
import { urlFor } from "@/lib/image-url";

export default function EventsExplorer({ events, now }) {
  const [period, setPeriod] = useState("upcoming");
  const [type, setType] = useState("all");
  const text = useContent();
  const labels = {
    conference: text.conference,
    seminar: text.seminar,
    workshop: text.workshop,
  };
  const shown = useMemo(
    () =>
      events
        .filter(
          (e) =>
            (period === "upcoming"
              ? new Date(e.endDateTime || e.eventDateTime).getTime() >= now
              : new Date(e.endDateTime || e.eventDateTime).getTime() < now) &&
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
              aria-pressed={period === x}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${period === x ? "bg-forest text-ivory" : "text-forest"}`}
            >
              {text[x]}
            </button>
          ))}
        </div>
        <FilterMenu
          label={text.filterEvents}
          value={type}
          options={[
            { value: "all", label: text.allEventTypes },
            { value: "conference", label: text.conferences },
            { value: "seminar", label: text.seminars },
            { value: "workshop", label: text.workshops },
          ]}
          onChange={setType}
        />
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {shown.length ? (
          shown.map((e) => {
            const d = new Date(e.eventDateTime);
            return (
              <Link
                key={e._id}
                href={e.slug?.current ? `/events/${e.slug.current}` : "/events"}
                className="premium-card event-card group grid overflow-hidden p-3 sm:grid-cols-[4.5rem_1fr]"
              >
                <div className="flex flex-col justify-between rounded-[1.25rem] bg-forest p-3 text-ivory">
                  <div>
                    <p className="font-sans text-3xl font-medium tracking-[-.05em]">
                      {d
                        .toLocaleDateString("en-US", {
                          day: "2-digit",
                          timeZone: "Asia/Karachi",
                        })
                        .padStart(2, "0")}
                    </p>
                    <p className="eyebrow mt-1 text-mint">
                      {d.toLocaleDateString("en-US", {
                        timeZone: "Asia/Karachi",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/25 transition group-hover:rotate-45 group-hover:bg-ivory group-hover:text-forest">
                    ↗
                  </span>
                </div>
                <div className="flex min-w-0 flex-col p-4 sm:p-5">
                  <div className="event-card-photo relative mb-4 aspect-[16/8] overflow-hidden rounded-xl bg-sage">
                    {urlFor(e.coverImage) && (
                      <Image
                        src={urlFor(e.coverImage)
                          ?.ignoreImageParams()
                          .width(900)
                          .fit("max")
                          .url()}
                        alt={e.coverImage?.alt || e.title}
                        fill
                        sizes="(max-width: 1024px) 70vw, 38vw"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <p className="eyebrow text-clay">
                      {labels[e.eventType] || e.eventType}
                    </p>
                    <h2 className="mt-3 font-sans text-xl font-semibold leading-tight tracking-[-.035em] text-forest">
                      {e.title}
                    </h2>
                    <p className="mt-3 text-sm text-carbon/55">{e.venue}</p>
                    {e.description && (
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-carbon/55">
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
            {text.noEvents}
          </div>
        )}
      </div>
    </div>
  );
}
