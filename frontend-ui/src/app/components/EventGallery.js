"use client";
import { useState } from "react";
import Image from "next/image";

export default function EventGallery({ images, text }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const item = images[index];
  const move = (step) => setIndex((current) => (current + step + images.length) % images.length);
  return (
    <div className="event-photo-viewer">
      <figure>
        <div className="event-photo-stage">
          <Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 92vw, 720px" className="object-contain" />
        </div>
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>
      {images.length > 1 && (
        <>
          <div className="gallery-controls">
            <button type="button" onClick={() => move(-1)} aria-label={text.previousImage}>←</button>
            <p role="status" aria-live="polite">{index + 1} / {images.length}</p>
            <button type="button" onClick={() => move(1)} aria-label={text.nextImage}>→</button>
          </div>
          <div className="gallery-thumbnails" aria-label={text.eventHighlights}>
            {images.map((image, position) => (
              <button type="button" key={image.key} aria-label={`${text.viewImage} ${position + 1}`} aria-pressed={position === index} onClick={() => setIndex(position)}>
                <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
