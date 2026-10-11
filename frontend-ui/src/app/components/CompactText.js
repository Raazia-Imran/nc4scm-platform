// Keep the CMS wording intact: a short lead with the remaining sentences
// available through a keyboard-accessible native disclosure.
export default function CompactText({ value, label, className = "" }) {
  if (typeof value !== "string" || !value.trim()) return null;
  const sentences = Array.from(
    new Intl.Segmenter("en", { granularity: "sentence" }).segment(value),
    (item) => item.segment.trim(),
  ).filter(Boolean);
  const [lead, ...rest] = sentences;
  return (
    <div className={`compact-text ${className}`}>
      <p>{lead}</p>
      {rest.length > 0 && (
        <details className="compact-disclosure">
          <summary>{label}</summary>
          <div className="sentence-grid">
            {rest.map((sentence, index) => <p key={index}>{sentence}</p>)}
          </div>
        </details>
      )}
    </div>
  );
}
