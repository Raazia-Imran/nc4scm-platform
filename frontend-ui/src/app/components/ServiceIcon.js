export default function ServiceIcon({ variant = 0, className = "" }) {
  const drawings = [
    <g key="layers">
      <path d="m4 9 8-5 8 5-8 5-8-5Z" />
      <path d="m4 13 8 5 8-5M4 17l8 5 8-5" />
    </g>,
    <g key="lab">
      <path d="M9 3h6M10 3v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3M8 15h8" />
      <circle cx="12" cy="17" r=".6" />
    </g>,
    <g key="material">
      <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10 9-5M12 13 3 8M12 13v9" />
      <path d="m7 5 10 6" />
    </g>,
    <g key="support">
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8 8M16 15l3-3M3 21l6-6M16 3l5 5-4 4-5-5 4-4Z" />
    </g>,
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {drawings[variant % drawings.length]}
    </svg>
  );
}
