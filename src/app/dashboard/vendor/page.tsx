import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deleteListing } from "@/actions/listings";
import { ButtonLink } from "@/components/button-link";
import { SubmitButton } from "@/components/pending";
import { EmptyState } from "@/components/empty-state";
import { RequestDecision } from "@/components/request-decision";
import { RoomTally } from "@/components/room-tally";
import { SectionHeading } from "@/components/section-heading";
import { BookingStatusBadge, ListingStatusBadge } from "@/components/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getVendorBoardings, getVendorBookings } from "@/lib/data";
import { months, plural, rupees, shortDate, timeAgo } from "@/lib/format";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My boardings" };

export default async function VendorDashboard({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; saved?: string }>;
}) {
  const vendor = await requireRole("vendor");
  const { added, saved } = await searchParams;

  const listings = await getVendorBoardings(vendor.id);
  const requests = await getVendorBookings(vendor.id);
  const waiting = requests.filter((r) => r.status === "pending");
  const answered = requests.filter((r) => r.status !== "pending");

  const roomsFree = listings
    .filter((l) => l.status === "approved")
    .reduce((n, l) => n + l.available_rooms, 0);

  return (
    <div className="space-y-12">
      {added || saved ? (
        <Alert className="border-lagoon/25 bg-lagoon-wash">
          <AlertDescription className="text-lagoon-deep">
            {added
              ? "Listing added. An admin checks it before students can see it."
              : "Listing saved."}
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Requests first: this is what a vendor opens the page for. */}
      <section id="requests">
        <SectionHeading
          eyebrow="Boarding owner"
          title={
            waiting.length
              ? `${plural(waiting.length, "request")} waiting`
              : "Incoming requests"
          }
        />

        {waiting.length ? (
          <ul className="space-y-3">
            {waiting.map((r) => (
              <li key={r.id}>
                <Card className="gap-0 py-4">
                  <CardContent className="px-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display font-bold tracking-tighter text-ink">
                          {r.student_name}
                        </p>
                        <p className="eyebrow mt-1">
                          {r.boarding_title} · {r.boarding_area}
                        </p>
                        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.75rem] text-ink-soft">
                          <div className="flex gap-1.5">
                            <dt className="text-ink-faint">Move in</dt>
                            <dd>{shortDate(r.move_in_date)}</dd>
                          </div>
                          <div className="flex gap-1.5">
                            <dt className="text-ink-faint">For</dt>
                            <dd>{months(r.duration_months)}</dd>
                          </div>
                          <div className="flex gap-1.5">
                            <dt className="text-ink-faint">Phone</dt>
                            <dd>{r.student_phone}</dd>
                          </div>
                          <div className="flex gap-1.5">
                            <dt className="text-ink-faint">Asked</dt>
                            <dd>{timeAgo(r.created_at)}</dd>
                          </div>
                        </dl>
                        {r.message ? (
                          <p className="mt-3 max-w-xl border-l-2 border-crust pl-3 text-[0.8125rem] leading-relaxed italic text-ink-soft">
                            {r.message}
                          </p>
                        ) : null}
                      </div>
                      <RequestDecision bookingId={r.id} />
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Nothing waiting"
            body="When a student requests one of your rooms it lands here with their move-in date and phone number."
          />
        )}

        {answered.length ? (
          <Collapsible className="mt-4 rounded-card border border-crust bg-surface">
            <CollapsibleTrigger className="w-full px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:text-lagoon">
              {plural(answered.length, "answered request")}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="divide-y divide-crust border-t border-crust">
                {answered.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{r.student_name}</p>
                      <p className="eyebrow mt-0.5">
                        {r.boarding_title} · from {shortDate(r.move_in_date)}
                      </p>
                    </div>
                    <BookingStatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </section>

      {/* Listings */}
      <section>
        <SectionHeading
          eyebrow={`${plural(roomsFree, "room")} free across your boardings`}
          title="My boardings"
          action={
            <ButtonLink href="/dashboard/vendor/new" size="sm">
              Add a boarding
            </ButtonLink>
          }
        />

        {listings.length ? (
          <ul className="space-y-3">
            {listings.map((l) => (
              <li key={l.id}>
                <Card className="gap-0 py-4">
                  <CardContent className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center">
                    <Link
                      href={`/boardings/${l.id}`}
                      className="relative h-24 shrink-0 overflow-hidden rounded-lg bg-crust sm:w-32"
                    >
                      {l.images[0] ? (
                        <Image
                          src={l.images[0]}
                          alt=""
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/boardings/${l.id}`}
                          className="font-display leading-snug font-bold tracking-tighter text-ink transition-colors hover:text-lagoon"
                        >
                          {l.title}
                        </Link>
                        <ListingStatusBadge status={l.status} />
                      </div>
                      <p className="eyebrow mt-1">
                        {l.area} · {rupees(l.price_per_month)}/mo
                      </p>
                      <RoomTally
                        className="mt-2.5"
                        total={l.total_rooms}
                        available={l.available_rooms}
                      />
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <ButtonLink
                        href={`/dashboard/vendor/${l.id}/edit`}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </ButtonLink>
                      <form action={deleteListing}>
                        <input type="hidden" name="id" value={l.id} />
                        <SubmitButton
                          variant="ghost"
                          size="sm"
                          className="text-ink-soft hover:bg-laterite-wash hover:text-laterite"
                          busyLabel="Deleting…"
                        >
                          Delete
                        </SubmitButton>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No boardings listed"
            body="Add the rooms you have free with the rent and a few photos. An admin approves it and students can find it the same day."
            action={
              <ButtonLink href="/dashboard/vendor/new">
                Add your first boarding
              </ButtonLink>
            }
          />
        )}
      </section>
    </div>
  );
}
