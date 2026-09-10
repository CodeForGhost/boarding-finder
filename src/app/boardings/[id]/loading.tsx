import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The room detail page reads the boarding, the owner and the student's own
 * request history before it can render anything, and the first thing it then
 * loads is a large photo. Without this the tap from a card leaves the student
 * on the old grid with nothing moving.
 *
 * The shape matches the real page - gallery left, request panel right - so the
 * layout does not jump when the content lands.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
        <Skeleton className="mb-6 h-4 w-48" />

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <Skeleton className="aspect-[16/10] rounded-card" />
            <div className="mt-3 flex gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-24 rounded-lg" />
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <Skeleton className="h-9 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <Skeleton className="h-[28rem] rounded-card" />
        </div>
      </main>
    </div>
  );
}
