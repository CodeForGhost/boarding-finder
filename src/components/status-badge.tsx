import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "border-crust-strong bg-salt text-ink-soft",
  good: "border-lagoon/25 bg-lagoon-wash text-lagoon-deep",
  warn: "border-sun/40 bg-sun-wash text-sun-ink",
  bad: "border-laterite/25 bg-laterite-wash text-laterite",
} as const;

export type Tone = keyof typeof TONES;

/** A badge in the app's own tones, on shadcn's badge geometry. */
export function ToneBadge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-2.5 py-1 font-mono text-[0.6875rem] font-normal tracking-[0.08em] uppercase",
        TONES[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
}

const LISTING = {
  approved: { tone: "good", label: "Live" },
  pending: { tone: "warn", label: "In review" },
  rejected: { tone: "bad", label: "Rejected" },
} as const;

export function ListingStatusBadge({ status }: { status: keyof typeof LISTING }) {
  return <ToneBadge tone={LISTING[status].tone}>{LISTING[status].label}</ToneBadge>;
}

const BOOKING = {
  confirmed: { tone: "good", label: "Confirmed" },
  pending: { tone: "warn", label: "Waiting" },
  rejected: { tone: "bad", label: "Declined" },
} as const;

export function BookingStatusBadge({ status }: { status: keyof typeof BOOKING }) {
  return <ToneBadge tone={BOOKING[status].tone}>{BOOKING[status].label}</ToneBadge>;
}
