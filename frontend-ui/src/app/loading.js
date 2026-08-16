export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-ivory">
      <div className="text-center">
        <span className="mx-auto block h-10 w-10 animate-pulse rounded-full bg-forest" />
        <p className="eyebrow mt-5 text-clay">Loading NC4SCM</p>
      </div>
    </div>
  );
}
