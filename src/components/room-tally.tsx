import { cn } from "@/lib/utils";

/**
 * The room tally: one square per room, filled for the rooms still free.
 *
 * It is the one place in the app where a number is drawn instead of written,
 * because "2 of 6" is the thing a student actually scans a page for. The
 * squares are also where the name comes from - a boarding, read a pixel at a
 * time.
 */
export function RoomTally({
  total,
  available,
  label = true,
  className,
}: {
  total: number;
  available: number;
  label?: boolean;
  className?: string;
}) {
  const shown = Math.min(total, 12);
  const overflow = total - shown;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center gap-[3px]"
        role="img"
        aria-label={`${available} of ${total} rooms free`}
      >
        {Array.from({ length: shown }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-2.5 rounded-[2px] border",
              i < available
                ? "border-lagoon bg-lagoon"
                : "border-crust-strong bg-transparent",
            )}
          />
        ))}
        {overflow > 0 ? (
          <span className="ml-0.5 font-mono text-[0.625rem] text-ink-faint">
            +{overflow}
          </span>
        ) : null}
      </div>
      {label ? (
        <span
          className={cn(
            "font-mono text-[0.6875rem] tracking-tight",
            available > 0 ? "text-ink-soft" : "text-laterite",
          )}
        >
          {available > 0 ? `${available} of ${total} free` : "Full"}
        </span>
      ) : null}
    </div>
  );
}
