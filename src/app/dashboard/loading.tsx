import { Skeleton } from "@/components/ui/skeleton";

/**
 * Every dashboard opens with several round trips to Supabase - the vendor page
 * fetches listings then requests, the admin page four counts and two queues -
 * and until they land the panel is blank. The sidebar around this is real: the
 * layout has already resolved by the time this shows, so only the work area
 * waits.
 *
 * Deliberately shape-neutral. A skeleton that promises a specific layout and
 * then delivers another is worse than one that only says "a heading, then a
 * stack of rows", which is true of all four screens under here.
 */
export default function Loading() {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-card" />
        ))}
      </div>
    </div>
  );
}
