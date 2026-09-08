import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A boarding read one pixel at a time: nine cells, the lit ones are rooms
 * still free. It is the room tally at logo size, which is the whole product in
 * one mark.
 */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  const lit = [0, 3, 4, 7];
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="var(--lagoon-deep)" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={5 + (i % 3) * 5}
          y={5 + Math.floor(i / 3) * 5}
          width="4"
          height="4"
          rx="1"
          fill={lit.includes(i) ? "var(--sun)" : "var(--salt)"}
          opacity={lit.includes(i) ? 1 : 0.28}
        />
      ))}
    </svg>
  );
}

/**
 * The wordmark. `tone="dark"` is for the ink panels, where the mark is dropped
 * and the type carries it alone.
 */
export function Wordmark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-display text-[1.0625rem] leading-none font-extrabold tracking-tighter",
        tone === "dark" ? "text-salt" : "text-ink",
        className,
      )}
    >
      Boarding
      <span className={tone === "dark" ? "text-sun" : "text-lagoon"}>Px</span>
    </span>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <LogoMark />
      <Wordmark />
    </Link>
  );
}
