import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, Wordmark } from "./logo";

/** Left rail carries the mark and the pitch; the form gets the right side. */
export function AuthShell({
  eyebrow,
  title,
  blurb,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden flex-col justify-between bg-ink p-10 lg:flex">
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <Wordmark tone="dark" />
        </Link>

        {/* The board at full size: lit cells are rooms somebody can still take. */}
        <div className="relative z-10">
          <div className="grid w-fit grid-cols-6 gap-1.5">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className={
                  [2, 5, 8, 9, 13, 16, 19, 22].includes(i)
                    ? "h-7 w-7 rounded-[3px] bg-sun"
                    : "h-7 w-7 rounded-[3px] border border-white/15"
                }
              />
            ))}
          </div>
          <p className="mt-8 max-w-sm font-display text-2xl font-bold leading-snug tracking-tighter text-salt">
            Every square is a room somebody can still take.
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-crust-strong">
            Owners keep the count honest because an approved request takes a
            room off the board on its own.
          </p>
        </div>

        <p className="relative z-10 font-mono text-[0.6875rem] tracking-[0.12em] text-white/35 uppercase">
          North Western Province · Sri Lanka
        </p>
      </aside>

      <main className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <p className="eyebrow mt-8 lg:mt-0">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tighter text-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{blurb}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-sm text-ink-soft">{footer}</div>
        </div>
      </main>
    </div>
  );
}
