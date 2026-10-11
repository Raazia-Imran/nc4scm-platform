"use client";
import { useEffect, useId, useRef, useState } from "react";
import FilterIcon from "./FilterIcon";
export default function FilterMenu({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false),
    root = useRef(null),
    trigger = useRef(null),
    list = useRef(null),
    id = useId();
  const current =
    options.find((option) => option.value === value) || options[0];
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.type === "pointerdown" && !root.current?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  useEffect(() => {
    if (open) list.current?.querySelector('[aria-selected="true"]')?.focus();
  }, [open]);
  function move(event, index) {
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % options.length;
    else if (event.key === "ArrowUp")
      next = (index + options.length - 1) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    list.current?.children[next]?.focus();
  }
  if (!current) return null;
  return (
    <div className="filter-menu" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="filter-menu-trigger"
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="listbox"
        onClick={() => setOpen((state) => !state)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <FilterIcon />
        <span>
          <span className="sr-only">{label}: </span>
          {current.label}
        </span>
        <span
          className={`filter-menu-chevron ${open ? "is-open" : ""}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>
      {open && (
        <div
          id={id}
          ref={list}
          className="filter-menu-popover"
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              role="option"
              tabIndex={option.value === current.value ? 0 : -1}
              aria-selected={option.value === value}
              className={`filter-menu-option ${option.value === value ? "is-active" : ""}`}
              onKeyDown={(e) => move(e, index)}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              {option.label}
              {option.value === value && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
