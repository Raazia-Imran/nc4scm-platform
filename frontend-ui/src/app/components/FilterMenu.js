"use client";

import { useEffect, useRef, useState } from "react";
import FilterIcon from "@/app/components/FilterIcon";

export default function FilterMenu({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const current = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape" || (event.type === "pointerdown" && !root.current?.contains(event.target))) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <div className="filter-menu" ref={root}>
      <button type="button" className="filter-menu-trigger" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((state) => !state)}>
        <FilterIcon />
        <span><span className="sr-only">{label}: </span>{current.label}</span>
        <span className={`filter-menu-chevron ${open ? "is-open" : ""}`} aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="filter-menu-popover" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={`filter-menu-option ${option.value === value ? "is-active" : ""}`} onClick={() => { onChange(option.value); setOpen(false); }}>
              {option.label}
              {option.value === value && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
