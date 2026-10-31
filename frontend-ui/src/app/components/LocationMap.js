"use client";
import { useState } from "react";

export default function LocationMap({ src, title }) {
  const [loaded, setLoaded] = useState(false);
  let safe;
  try {
    const url = new URL(src);
    safe = url.protocol === "https:" && ["www.openstreetmap.org", "www.google.com", "maps.google.com"].includes(url.hostname);
  } catch { safe = false; }
  if (!safe) return null;
  return (
    <div className="flex min-h-[280px] flex-col justify-center gap-4 p-6">
      {loaded ? (
        <>
          <iframe src={src} title={title || "NC4SCM location"} referrerPolicy="no-referrer" className="h-[280px] w-full border-0" />
          <button type="button" onClick={() => setLoaded(false)} className="text-link self-start">Close map</button>
        </>
      ) : (
        <>
          <p className="text-sm leading-7">Loading the map connects to its external provider and shares your IP address and browser information. Your choice lasts only while this map is open.</p>
          <button type="button" onClick={() => setLoaded(true)} className="button button-dark self-start">Load location map</button>
          <a href="/cookies" className="text-link self-start">About external maps</a>
        </>
      )}
    </div>
  );
}
