export default function Loading() {
  return (
    <div role="status" aria-label="Loading page" className="bg-ivory">
      <section className="page-hero text-ivory">
        <div className="page-hero-inner animate-pulse">
          <div className="h-3 w-28 rounded-full bg-ivory/30" />
          <div className="mt-8 h-10 w-full max-w-xl rounded-lg bg-ivory/20" />
          <div className="mt-5 h-4 w-full max-w-2xl rounded bg-ivory/15" />
          <div className="mt-3 h-4 w-2/3 max-w-lg rounded bg-ivory/15" />
        </div>
      </section>
      <div className="section-shell animate-pulse" aria-hidden="true">
        <div className="h-5 w-40 rounded bg-forest/10" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-48 rounded-[1.5rem] bg-forest/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
