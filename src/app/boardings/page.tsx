import type { Metadata } from "next";
import Link from "next/link";
import { BoardingCard } from "@/components/boarding-card";
import { Filters } from "@/components/filters";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ButtonLink, EmptyState } from "@/components/ui";
import { searchBoardings } from "@/lib/data";
import { plural, rupees } from "@/lib/format";
import type { Gender } from "@/lib/types";

export const metadata: Metadata = { title: "Boardings" };

type Search = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
}

function num(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const SORTS = [
  { value: "recent", label: "Newest" },
  { value: "price_asc", label: "Cheapest" },
  { value: "price_desc", label: "Priciest" },
] as const;

export default async function BoardingsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const area = one(sp.area);
  const max = one(sp.max);
  const min = one(sp.min);
  const gender = one(sp.gender) as Gender | undefined;
  const q = one(sp.q);
  const sort = (one(sp.sort) ?? "recent") as "recent" | "price_asc" | "price_desc";

  const results = await searchBoardings({
    area,
    max: num(max),
    min: num(min),
    gender,
    q,
    sort,
  });

  const active = { area, max, min, gender, q, sort };
  const chips = [
    area && { key: "area", label: area },
    gender && { key: "gender", label: gender === "mixed" ? "Mixed" : gender === "male" ? "Men only" : "Women only" },
    min && { key: "min", label: `From ${rupees(Number(min))}` },
    max && { key: "max", label: `Up to ${rupees(Number(max))}` },
    q && { key: "q", label: `“${q}”` },
  ].filter(Boolean) as { key: string; label: string }[];

  const sortHref = (value: string) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ area, max, min, gender, q })) {
      if (v) params.set(k, String(v));
    }
    if (value !== "recent") params.set("sort", value);
    const qs = params.toString();
    return qs ? `/boardings?${qs}` : "/boardings";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <div className="mb-8">
          <p className="eyebrow mb-2">Boardings</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {area ? `Rooms in ${area}` : "Rooms across Puttalam"}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {plural(results.length, "boarding")} match
            {results.length === 1 ? "es" : ""} your filters.
          </p>

          {chips.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <span
                  key={c.key}
                  className="inline-flex items-center rounded-full border border-lagoon/25 bg-lagoon-wash px-3 py-1 text-[0.8125rem] text-lagoon-deep"
                >
                  {c.label}
                </span>
              ))}
              <Link
                href="/boardings"
                className="ml-1 text-[0.8125rem] text-ink-soft underline underline-offset-4 transition-colors hover:text-laterite"
              >
                Clear
              </Link>
            </div>
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-card border border-crust bg-surface p-5">
              <Filters active={active} />
            </div>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-end gap-1">
              <span className="eyebrow mr-2">Sort</span>
              {SORTS.map((s) => (
                <Link
                  key={s.value}
                  href={sortHref(s.value)}
                  className={
                    sort === s.value
                      ? "rounded-full bg-ink px-3 py-1.5 text-[0.8125rem] text-salt"
                      : "rounded-full px-3 py-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:bg-lagoon-wash hover:text-lagoon-deep"
                  }
                >
                  {s.label}
                </Link>
              ))}
            </div>

            {results.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((b, i) => (
                  <BoardingCard key={b.id} boarding={b} priority={i < 3} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing matches those filters yet"
                body="Raise the budget, drop the area, or clear the filters to see every boarding on the board."
                action={
                  <ButtonLink href="/boardings" variant="outline">
                    Clear filters
                  </ButtonLink>
                }
              />
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
