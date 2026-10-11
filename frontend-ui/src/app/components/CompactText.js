// Present every CMS sentence without hiding or rewriting the supplied copy.
export default function CompactText({ value, className = "" }) {
  if (typeof value !== "string" || !value.trim()) return null;
  const sentences = Array.from(new Intl.Segmenter("en", { granularity: "sentence" }).segment(value), item => item.segment.trim()).filter(Boolean);
  return <div className={`compact-text ${className}`}><div className={sentences.length > 1 ? "sentence-grid" : ""}>{sentences.map((sentence, index) => <p key={index}>{sentence}</p>)}</div></div>;
}
