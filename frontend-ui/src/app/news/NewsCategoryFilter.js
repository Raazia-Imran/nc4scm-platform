"use client";

import { useEffect, useId, useRef, useState } from "react";
import FilterIcon from "@/app/components/FilterIcon";

export default function NewsCategoryFilter({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  const select = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className="news-category-filter">
      <div className="news-filter-tags" aria-label="Filter news by category">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`news-filter-tag ${option.value === value ? "is-active" : ""}`}
            aria-pressed={option.value === value}
            onClick={() => select(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        ref={triggerRef}
        type="button"
        className="news-filter-mobile-trigger"
        aria-expanded={open}
        aria-controls={`${titleId}-sheet`}
        onClick={() => setOpen(true)}
      >
        <FilterIcon />
        <span>Filter news</span>
        <span className="news-filter-mobile-value">
          {options.find((option) => option.value === value)?.label}
        </span>
      </button>

      {open && (
        <div
          id={`${titleId}-sheet`}
          className="news-filter-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="news-filter-sheet-header">
            <div>
              <p className="eyebrow text-clay">News & insight</p>
              <h2 id={titleId} className="news-filter-sheet-title">
                Filter by category
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="news-filter-sheet-close"
              aria-label="Close news filters"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">&#215;</span>
            </button>
          </div>

          <div className="news-filter-sheet-options">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`news-filter-sheet-option ${option.value === value ? "is-active" : ""}`}
                aria-pressed={option.value === value}
                onClick={() => select(option.value)}
              >
                <span>{option.label}</span>
                <span aria-hidden="true">{option.value === value ? "✓" : "→"}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
