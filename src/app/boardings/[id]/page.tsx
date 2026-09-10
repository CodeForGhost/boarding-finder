import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { ButtonLink } from "@/components/button-link";
import { Gallery } from "@/components/gallery";
import { RoomTally } from "@/components/room-tally";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ToneBadge } from "@/components/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBoarding, hasOpenRequest, searchBoardings } from "@/lib/data";
import { rupees, timeAgo } from "@/lib/format";
import { getUser } from "@/lib/session";
import { genderLabel } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const boarding = await getBoarding(id);
  // A listing still in review is not public, so its name must not reach the
  // browser tab or a link preview either.
  if (!boarding || boarding.status !== "approved") return { title: "Boarding" };
  return { title: `${boarding.title}, ${boarding.area}` };
}

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default async function BoardingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boarding = await getBoarding(id);
  const user = await getUser();

  if (!boarding) notFound();

  const isOwner = user?.id === boarding.vendor_id;
  const visible = boarding.status === "approved" || isOwner || user?.role === "admin";
  if (!visible) notFound();

  const nearby = (await searchBoardings({ area: boarding.area }))
    .filter((b) => b.id !== boarding.id)
    .slice(0, 3);

  const full = boarding.available_rooms === 0;
  const alreadyAsked =
    user?.role === "student" && (await hasOpenRequest(boarding.id, user.id));

  const reason = !user
    ? {
        text: "Sign in as a student to send the owner a request.",
        href: `/login?next=/boardings/${boarding.id}`,
        cta: "Sign in",
      }
    : user.role !== "student"
      ? {
          text: `Requests come from student accounts. This one is signed in as a ${user.role}.`,
        }
      : alreadyAsked
        ? {
            text: "You already have a request waiting on this boarding.",
            href: "/dashboard/student",
            cta: "See my requests",
          }
        : full
          ? {
              text: "Every room here is taken. The owner will update the count when one frees up.",
            }
          : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-soft">
          <Link href="/boardings" className="transition-colors hover:text-lagoon">
            Boardings
          </Link>
          <span className="text-ink-faint">/</span>
          <Link
            href={`/boardings?area=${encodeURIComponent(boarding.area)}`}
            className="transition-colors hover:text-lagoon"
          >
            {boarding.area}
          </Link>
        </nav>

        {boarding.status !== "approved" ? (
          <Alert className="mb-6 border-sun/40 bg-sun-wash">
            <AlertDescription className="text-sun-ink">
              {boarding.status === "pending"
                ? "This listing is still waiting for admin approval."
                : "This listing was rejected. Edit it to send it back for review."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <Gallery images={boarding.images} alt={boarding.title} />

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <ToneBadge>{boarding.area}</ToneBadge>
                <ToneBadge tone="good">{genderLabel(boarding.gender)}</ToneBadge>
                {full ? <ToneBadge tone="bad">Full</ToneBadge> : null}
              </div>

              <h1 className="mt-3 font-display text-3xl leading-tight font-extrabold tracking-tighter text-ink sm:text-[2.25rem]">
                {boarding.title}
              </h1>
              <p className="mt-2 text-sm text-ink-soft">{boarding.address}</p>

              <p className="mt-6 text-[0.9375rem] leading-relaxed whitespace-pre-line text-ink-soft">
                {boarding.description}
              </p>

              <div className="mt-8">
                <h2 className="eyebrow mb-3">What is included</h2>
                <div className="flex flex-wrap gap-2">
                  {boarding.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-crust bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft"
                    >
                      {a}
                    </span>
                  ))}
                  {boarding.amenities.length === 0 ? (
                    <span className="text-sm text-ink-faint">
                      The owner has not listed anything yet.
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="mt-8 text-xs text-ink-faint">
                Listed {timeAgo(boarding.created_at)}
              </p>
            </div>
          </div>

          {/* Booking rail */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="gap-0 py-5">
              <CardContent className="px-5">
                <div className="flex items-end justify-between gap-3 pb-4">
                  <div>
                    <p className="font-mono text-[1.75rem] leading-none font-medium tracking-tighter text-ink">
                      {rupees(boarding.price_per_month)}
                    </p>
                    <p className="eyebrow mt-1.5">per month</p>
                  </div>
                  <RoomTally
                    total={boarding.total_rooms}
                    available={boarding.available_rooms}
                    label={false}
                  />
                </div>

                <Separator />

                <p className="py-4 text-sm text-ink-soft">
                  {full
                    ? "No rooms free right now."
                    : `${boarding.available_rooms} of ${boarding.total_rooms} rooms still free.`}
                </p>

                <BookingForm
                  boardingId={boarding.id}
                  minDate={tomorrow()}
                  canRequest={!reason}
                  reason={reason}
                />
              </CardContent>
            </Card>

            <Card className="mt-4 gap-0 py-5">
              <CardContent className="px-5">
                <h2 className="eyebrow mb-3">Owner</h2>
                <p className="font-display font-bold tracking-tighter text-ink">
                  {boarding.vendor_name}
                </p>
                <dl className="mt-2 space-y-1 font-mono text-[0.8125rem] text-ink-soft">
                  <div className="flex gap-2">
                    <dt className="text-ink-faint">Phone</dt>
                    <dd>{boarding.vendor_phone}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-faint">Email</dt>
                    <dd className="break-all">{boarding.vendor_email}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>

        {nearby.length ? (
          <section className="mt-16 border-t border-crust pt-10">
            <div className="mb-5 flex items-end justify-between gap-3">
              <h2 className="font-display text-xl font-bold tracking-tighter text-ink">
                Also in {boarding.area}
              </h2>
              <ButtonLink
                href={`/boardings?area=${encodeURIComponent(boarding.area)}`}
                variant="outline"
                size="sm"
              >
                See all
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {nearby.map((b) => (
                <Link
                  key={b.id}
                  href={`/boardings/${b.id}`}
                  className="rounded-card border border-crust bg-surface p-4 transition-colors hover:border-lagoon"
                >
                  <p className="font-display leading-snug font-bold tracking-tighter text-ink">
                    {b.title}
                  </p>
                  <p className="mt-2 font-mono text-sm text-lagoon-deep">
                    {rupees(b.price_per_month)}
                    <span className="text-ink-faint">/mo</span>
                  </p>
                  <RoomTally
                    className="mt-3"
                    total={b.total_rooms}
                    available={b.available_rooms}
                  />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
