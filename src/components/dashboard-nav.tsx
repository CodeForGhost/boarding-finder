"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

export type NavItem = { href: string; label: string; count?: number };

export function DashboardNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  // Only the most specific match lights up, so /dashboard/vendor/new highlights
  // "Add a boarding" and not "Listings & requests" as well.
  const best = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
      {items.map((item) => {
        const active = item.href === best?.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex shrink-0 items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-sm transition-colors",
              active
                ? "bg-ink text-salt"
                : "text-ink-soft hover:bg-lagoon-wash hover:text-lagoon-deep",
            )}
          >
            {item.label}
            {item.count ? (
              <span
                className={cx(
                  "rounded-full px-1.5 py-0.5 font-mono text-[0.625rem]",
                  active ? "bg-white/15 text-salt" : "bg-sun-wash text-[#8a5b0c]",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
