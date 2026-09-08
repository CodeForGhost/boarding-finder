import Link from "next/link";
import { BoardingCard } from "@/components/boarding-card";
import { ButtonLink } from "@/components/button-link";
import { HeroSearch } from "@/components/hero-search";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import {
  getAreaBreakdown,
  getAreaCounts,
  getBoardStats,
  getFeaturedBoardings,
} from "@/lib/data";
import { rupees } from "@/lib/format";

export default async function HomePage() {
  const featured = await getFeaturedBoardings(6);
  const areas = await getAreaCounts();
  const stats = await getBoardStats();
  const byArea = (await getAreaBreakdown())
    .slice()
    .sort((a, b) => b.rooms - a.rooms);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* The search is the product, so it gets the weight. */}
        <section className="border-b border-crust bg-gradient-to-b from-lagoon-wash/70 to-salt">
          <div className="mx-auto max-w-6xl px-5 pt-14 pb-14 sm:pt-20">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_300px]">
              <div>
                <p className="rise eyebrow mb-4">
                  Puttalam · Kalladi · Palaviya · Thillayadi
                </p>
                <h1
                  className="rise font-display text-[2.5rem] leading-[1.05] font-extrabold tracking-tighter text-ink sm:text-[3.5rem]"
                  style={{ animationDelay: "60ms" }}
                >
                  Find the room before you get on the bus.
                </h1>
                <p
                  className="rise mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
                  style={{ animationDelay: "110ms" }}
                >
                  Every boarding here shows the rent and how many rooms are
                  still free. Send the owner a request from the listing instead
                  of ringing a number that never picks up.
                </p>
              </div>

              {/* The board itself: one square per free room, by area. */}
              <div
                className="rise rounded-card border border-crust bg-surface/70 p-5 backdrop-blur"
                style={{ animationDelay: "140ms" }}
              >
                <p className="eyebrow mb-4">Free right now</p>
                <ul className="space-y-3">
                  {byArea.slice(0, 5).map((a) => (
                    <li key={a.area}>
                      <Link
                        href={`/boardings?area=${encodeURIComponent(a.area)}`}
                        className="group block"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-[0.8125rem] text-ink transition-colors group-hover:text-lagoon">
                            {a.area}
                          </span>
                          <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint">
                            {a.rooms}
                          </span>
                        </div>
                        <div className="mt-1.5 flex gap-[3px]">
                          {Array.from({ length: Math.min(a.rooms, 10) }, (_, i) => (
                            <span
                              key={i}
                              className="h-2 w-2 rounded-[2px] bg-lagoon transition-colors group-hover:bg-lagoon-deep"
                            />
                          ))}
                          {Array.from(
                            { length: Math.max(0, 10 - Math.min(a.rooms, 10)) },
                            (_, i) => (
                              <span
                                key={`e${i}`}
                                className="h-2 w-2 rounded-[2px] border border-crust-strong"
                              />
                            ),
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-crust pt-3 text-xs leading-relaxed text-ink-faint">
                  One square is one room. Owners keep the count honest because a
                  confirmed request takes a room off the board on its own.
                </p>
              </div>
            </div>

            <div className="mt-9">
              <HeroSearch />
            </div>

            <div
              className="rise mt-6 flex flex-wrap items-center gap-2"
              style={{ animationDelay: "220ms" }}
            >
              <span className="eyebrow mr-1">Popular</span>
              {areas.slice(0, 6).map((a) => (
                <Link
                  key={a.area}
                  href={`/boardings?area=${encodeURIComponent(a.area)}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-crust-strong bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:border-lagoon hover:text-lagoon-deep"
                >
                  {a.area}
                  <span className="font-mono text-[0.6875rem] text-ink-faint group-hover:text-lagoon">
                    {a.n}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* A live read of the board, not marketing copy. */}
        <section className="border-b border-crust bg-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-crust px-5 sm:grid-cols-4 sm:divide-x">
            {[
              { k: "Boardings listed", v: String(stats.listings) },
              { k: "Rooms free today", v: String(stats.rooms_available) },
              { k: "Typical rent", v: rupees(stats.median_price) },
              {
                k: "Rent range",
                v: `${(stats.min_price / 1000).toFixed(1)}k to ${(stats.max_price / 1000).toFixed(1)}k`,
              },
            ].map((s) => (
              <div key={s.k} className="px-1 py-6 sm:px-6">
                <p className="font-mono text-2xl font-medium tracking-tighter text-lagoon-deep">
                  {s.v}
                </p>
                <p className="eyebrow mt-1">{s.k}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading
            eyebrow="Taking students now"
            title="Rooms with space left"
            action={
              <ButtonLink href="/boardings" variant="outline" size="sm">
                See all boardings
              </ButtonLink>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b, i) => (
              <BoardingCard key={b.id} boarding={b} priority={i < 3} />
            ))}
          </div>
        </section>

        {/* For owners */}
        <section className="mx-auto max-w-6xl px-5 pb-4">
          <div className="overflow-hidden rounded-card border border-crust bg-ink">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow mb-3 text-sun">For boarding owners</p>
                <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tighter text-salt sm:text-[2.25rem]">
                  Stop repeating yourself on the phone.
                </h2>
                <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-crust-strong">
                  List the rooms once with the rent, the rules and the photos.
                  Students send a request with their move-in date and how long
                  they need. You approve or decline, and the room count updates
                  itself.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink
                    href="/register?role=vendor"
                    size="lg"
                    className="bg-sun text-ink hover:bg-white"
                  >
                    List your boarding
                  </ButtonLink>
                  <ButtonLink
                    href="/login"
                    size="lg"
                    variant="ghost"
                    className="text-crust-strong hover:bg-white/10 hover:text-white"
                  >
                    I already have an account
                  </ButtonLink>
                </div>
              </div>

              <ol className="space-y-4 border-l border-white/15 pl-6 text-sm text-crust-strong">
                {[
                  "Add the boarding with rooms, rent and photos.",
                  "An admin checks it and puts it on the board.",
                  "Requests arrive with a name, a date and a message.",
                ].map((step, i) => (
                  <li key={step} className="relative">
                    <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-sun font-mono text-[0.625rem] text-ink">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
