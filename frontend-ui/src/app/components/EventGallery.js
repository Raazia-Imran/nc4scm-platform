"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function EventGallery({
  images = [],
  text = {},
  label = text.eventHighlights || "Photo gallery",
}) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef(null),
    opener = useRef(null),
    pointer = useRef(null),
    previousOverflow = useRef(null);
  const position = index % Math.max(images.length, 1);
  const move = (step) =>
    setIndex((current) => (current + step + images.length) % images.length);
  useEffect(
    () => () => {
      if (previousOverflow.current !== null)
        document.body.style.overflow = previousOverflow.current;
    },
    [],
  );
  useEffect(() => {
    if (expanded) {
      previousOverflow.current = document.body.style.overflow;
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    }
  }, [expanded]);
  if (!images.length) return null;
  const item = images[position];
  const close = () => {
    dialog.current?.close();
    setExpanded(false);
    document.body.style.overflow = previousOverflow.current || "";
    previousOverflow.current = null;
    opener.current?.focus();
  };
  const open = (event) => {
    opener.current = event.currentTarget;
    setExpanded(true);
  };
  const gestures = {
    onPointerDown: (event) => {
      if (event.button !== 0 || event.target.closest("button")) return;
      pointer.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    onPointerUp: (event) => {
      if (!pointer.current) return;
      const x = event.clientX - pointer.current.x,
        y = event.clientY - pointer.current.y;
      pointer.current = null;
      if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.3)
        move(x < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      pointer.current = null;
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    },
  };
  const controls = (
    <div className="gallery-controls">
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label={text.previousImage || "Previous photograph"}
      >
        ←
      </button>
      <p role="status" aria-live="polite">
        {position + 1} / {images.length}
      </p>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label={text.nextImage || "Next photograph"}
      >
        →
      </button>
    </div>
  );
  return (
    <div className="event-photo-viewer" role="region" aria-label={label}>
      <figure>
        <div
          className="event-photo-stage swipe-stage"
          tabIndex={0}
          aria-label="Photograph. Swipe, drag or use left and right arrow keys to browse."
          {...gestures}
        >
          <Image
            src={item.src}
            alt={item.alt || ""}
            fill
            sizes="(max-width:767px) 92vw, 1000px"
            draggable={false}
            className="object-contain pointer-events-none"
          />
          <button
            type="button"
            onClick={open}
            className="gallery-expand"
            aria-label="Open photograph fullscreen"
          >
            Expand ↗
          </button>
        </div>
        <figcaption className="gallery-caption">
          <span>
            {item.caption || item.alt}
            {item.credit && <small>Photography: {item.credit}</small>}
          </span>
          <span className="gallery-swipe-hint">
            Swipe or drag to explore ↔
          </span>
        </figcaption>
      </figure>
      {images.length > 1 && (
        <>
          {controls}
          <div className="gallery-thumbnails" aria-label={label}>
            {images.map((photo, i) => (
              <button
                type="button"
                key={photo.key || i}
                aria-label={`${text.viewImage || "View photograph"} ${i + 1}`}
                aria-pressed={position === i}
                onClick={() => setIndex(i)}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        className="archive-lightbox"
        aria-label={label}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {expanded && (
          <div className="archive-lightbox-inner">
            <button
              type="button"
              onClick={close}
              className="archive-lightbox-close"
              aria-label="Close fullscreen photograph"
            >
              Close ×
            </button>
            <div
              className="event-photo-stage swipe-stage"
              tabIndex={0}
              {...gestures}
            >
              <Image
                src={item.src}
                alt={item.alt || ""}
                fill
                sizes="95vw"
                draggable={false}
                className="object-contain pointer-events-none"
              />
            </div>
            <p className="gallery-caption">{item.caption || item.alt}</p>
            {images.length > 1 && controls}
          </div>
        )}
      </dialog>
    </div>
  );
}
