import { Skeleton } from "@/components/ui/skeleton";

/**
 * The edit screen has to read the listing before it can fill the form, so it
 * gets its own fallback rather than the stack of rows the other dashboard
 * screens use - one tall form card is what actually arrives.
 */
export default function Loading() {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-72" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-[36rem] rounded-card" />
    </div>
  );
}
