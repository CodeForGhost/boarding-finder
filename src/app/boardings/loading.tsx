import { SiteHeader } from "@/components/site-header";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-crust bg-surface">
      <div className="aspect-[4/3] animate-pulse bg-crust" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-crust" />
        <div className="h-3 w-full animate-pulse rounded bg-crust" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-crust" />
        <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-crust" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-crust" />
          <div className="h-9 w-72 animate-pulse rounded bg-crust" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <div className="h-96 animate-pulse rounded-card bg-crust/60" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
