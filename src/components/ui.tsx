import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- buttons --- */

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium " +
  "transition-[background-color,color,border-color,transform] duration-150 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const VARIANTS = {
  primary: "bg-lagoon text-white hover:bg-lagoon-deep",
  secondary: "bg-ink text-salt hover:bg-lagoon-deep",
  outline: "border border-crust-strong bg-surface text-ink hover:border-lagoon hover:text-lagoon",
  ghost: "text-ink-soft hover:bg-lagoon-wash hover:text-lagoon-deep",
  danger: "border border-laterite/30 bg-laterite-wash text-laterite hover:bg-laterite hover:text-white",
} as const;

const SIZES = {
  sm: "h-8 px-3 text-[0.8125rem]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
} as const;

type ButtonLook = { variant?: keyof typeof VARIANTS; size?: keyof typeof SIZES };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & ButtonLook) {
  return (
    <button
      className={cx(BUTTON_BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonLook) {
  return (
    <Link
      className={cx(BUTTON_BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- cards --- */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cx(
        "rounded-card border border-crust bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-crust-strong bg-surface/60 px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-soft">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/* --------------------------------------------------------------- signals --- */

const TONES = {
  neutral: "border-crust-strong bg-salt text-ink-soft",
  good: "border-lagoon/25 bg-lagoon-wash text-lagoon-deep",
  warn: "border-sun/40 bg-sun-wash text-[#8a5b0c]",
  bad: "border-laterite/25 bg-laterite-wash text-laterite",
} as const;

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const LISTING_TONE = { approved: "good", pending: "warn", rejected: "bad" } as const;
const LISTING_LABEL = { approved: "Live", pending: "In review", rejected: "Rejected" } as const;

export function ListingStatusBadge({ status }: { status: keyof typeof LISTING_TONE }) {
  return <Badge tone={LISTING_TONE[status]}>{LISTING_LABEL[status]}</Badge>;
}

const BOOKING_TONE = { confirmed: "good", pending: "warn", rejected: "bad" } as const;
const BOOKING_LABEL = { confirmed: "Confirmed", pending: "Waiting", rejected: "Declined" } as const;

export function BookingStatusBadge({ status }: { status: keyof typeof BOOKING_TONE }) {
  return <Badge tone={BOOKING_TONE[status]}>{BOOKING_LABEL[status]}</Badge>;
}

/**
 * The room tally: one square per room, filled for the rooms still free.
 * It is the one place in the app where a number is drawn instead of written,
 * because "2 of 6" is the thing a student actually scans a page for.
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
    <div className={cx("flex items-center gap-2", className)}>
      <div
        className="flex items-center gap-[3px]"
        role="img"
        aria-label={`${available} of ${total} rooms free`}
      >
        {Array.from({ length: shown }, (_, i) => (
          <span
            key={i}
            className={cx(
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
          className={cx(
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
