import { getSiteContent } from "@/lib/content";
import Link from "next/link";
export default async function NotFound() {
  const site = await getSiteContent();
  const text = site.interfaceText || {};
  return (
    <section className="grid min-h-screen place-items-center bg-forest px-6 pt-28 text-center text-ivory">
      <div>
        <p className="eyebrow text-mint">404 · {text.notFound}</p>
        <h1 className="mt-6 font-display text-6xl sm:text-8xl">
          {text.notFoundHeading}
        </h1>
        <p className="mx-auto mt-6 max-w-lg leading-7 text-ivory/65">
          {text.notFoundBody}
        </p>
        <Link href="/" className="button button-light mt-9">
          {text.returnHome} <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
