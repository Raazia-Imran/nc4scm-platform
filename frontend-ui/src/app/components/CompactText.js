// Present every CMS sentence without hiding or rewriting the supplied copy.
export default function CompactText({ value, className = "" }) {
  if (typeof value !== "string" || !value.trim()) return null;
  return <div className={`compact-text ${className}`}><p className="whitespace-pre-line">{value}</p></div>;
}
