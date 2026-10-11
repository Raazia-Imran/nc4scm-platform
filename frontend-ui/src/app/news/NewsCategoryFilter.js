"use client";
import { useContent } from "@/app/components/ContentProvider";
export default function NewsCategoryFilter({ value, options, onChange }) {
  const text = useContent();
  return (
    <div
      className="news-filter-tags"
      role="group"
      aria-label={text.filterCategory}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`news-filter-tag ${option.value === value ? "is-active" : ""}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
