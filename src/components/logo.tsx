import Link from "next/link";

/** Three salt pans seen from above; the filled one is a room still free. */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="var(--color-lagoon-deep)" />
      <rect x="5" y="5.5" width="6" height="6" rx="1.2" fill="var(--color-salt)" opacity="0.55" />
      <rect x="13" y="5.5" width="6" height="6" rx="1.2" fill="var(--color-salt)" opacity="0.3" />
      <rect x="5" y="13" width="6" height="6" rx="1.2" fill="var(--color-salt)" opacity="0.3" />
      <rect x="13" y="13" width="6" height="6" rx="1.2" fill="var(--color-sun)" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[1.0625rem] font-bold leading-none tracking-tight text-ink">
        Puttalam<span className="hidden font-normal text-ink-soft sm:inline"> Boarding</span>
      </span>
    </Link>
  );
}
