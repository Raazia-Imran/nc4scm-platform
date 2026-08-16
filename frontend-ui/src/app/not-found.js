import Link from "next/link";
export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-forest px-6 pt-28 text-center text-ivory">
      <div>
        <p className="eyebrow text-mint">404 · Page not found</p>
        <h1 className="mt-6 font-display text-6xl sm:text-8xl">
          This path ends here.
        </h1>
        <p className="mx-auto mt-6 max-w-lg leading-7 text-ivory/65">
          The page may have moved, or the content may not yet be published.
        </p>
        <Link href="/" className="button button-light mt-9">
          Return home <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
