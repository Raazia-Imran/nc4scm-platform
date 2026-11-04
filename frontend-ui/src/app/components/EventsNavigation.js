import Link from "next/link";
export default function EventsNavigation({ timeline = false }) {
  return (
    <nav className="archive-tabs" aria-label="Events views">
      <Link href="/events" aria-current={!timeline ? "page" : undefined}>
        Events & gatherings
      </Link>
      <Link
        href="/events/timeline"
        aria-current={timeline ? "page" : undefined}
      >
        Journey in pictures <span aria-hidden="true">↗</span>
      </Link>
    </nav>
  );
}
