import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-crust bg-surface">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="mt-4 h-3 w-1/2" />
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
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-72" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <Skeleton className="h-96 rounded-card" />
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
