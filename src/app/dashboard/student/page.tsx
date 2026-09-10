import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { withdrawRequest } from "@/actions/bookings";
import { ButtonLink } from "@/components/button-link";
import { SubmitButton } from "@/components/pending";
import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/section-heading";
import { BookingStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getStudentBookings } from "@/lib/data";
import { months, rupees, shortDate, timeAgo } from "@/lib/format";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My requests" };

const ORDER = { pending: 0, confirmed: 1, rejected: 2 } as const;

export default async function StudentDashboard() {
  const user = await requireRole("student");
  const bookings = (await getStudentBookings(user.id)).sort(
    (a, b) => ORDER[a.status] - ORDER[b.status],
  );

  const waiting = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div>
      <SectionHeading
        eyebrow="Student"
        title="My booking requests"
        action={
          <ButtonLink href="/boardings" size="sm">
            Find another room
          </ButtonLink>
        }
      />

      {bookings.length ? (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            {[
              { label: "Waiting on an answer", value: waiting },
              { label: "Confirmed", value: confirmed },
              { label: "Requests sent", value: bookings.length },
            ].map((s) => (
              <Card key={s.label} className="flex-1 gap-0 py-3">
                <CardContent className="px-4">
                  <p className="font-mono text-xl font-medium text-lagoon-deep">
                    {s.value}
                  </p>
                  <p className="eyebrow mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <ul className="space-y-3">
            {bookings.map((b) => (
              <li key={b.id}>
                <Card className="gap-0 overflow-hidden py-0">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                    <Link
                      href={`/boardings/${b.boarding_id}`}
                      className="relative h-28 shrink-0 overflow-hidden rounded-lg bg-crust sm:h-24 sm:w-36"
                    >
                      {b.boarding_image ? (
                        <Image
                          src={b.boarding_image}
                          alt=""
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/boardings/${b.boarding_id}`}
                            className="font-display leading-snug font-bold tracking-tighter text-ink transition-colors hover:text-lagoon"
                          >
                            {b.boarding_title}
                          </Link>
                          <p className="eyebrow mt-1">
                            {b.boarding_area} · {rupees(b.boarding_price)}/mo
                          </p>
                        </div>
                        <BookingStatusBadge status={b.status} />
                      </div>

                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.75rem] text-ink-soft">
                        <div className="flex gap-1.5">
                          <dt className="text-ink-faint">Move in</dt>
                          <dd>{shortDate(b.move_in_date)}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-ink-faint">For</dt>
                          <dd>{months(b.duration_months)}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-ink-faint">Sent</dt>
                          <dd>{timeAgo(b.created_at)}</dd>
                        </div>
                      </dl>

                      {b.message ? (
                        <p className="mt-3 border-l-2 border-crust pl-3 text-[0.8125rem] leading-relaxed italic text-ink-soft">
                          {b.message}
                        </p>
                      ) : null}
                    </div>
                  </CardContent>

                  <CardFooter className="justify-between gap-3 border-t bg-salt px-4 py-2.5">
                    <p className="text-[0.8125rem] text-ink-soft">
                      {b.status === "pending"
                        ? "The owner has not answered yet."
                        : b.status === "confirmed"
                          ? "Confirmed. Call the owner to arrange the keys."
                          : "The owner declined this one."}
                    </p>
                    {b.status === "pending" ? (
                      <form action={withdrawRequest}>
                        <input type="hidden" name="booking_id" value={b.id} />
                        <SubmitButton
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-[0.8125rem] text-ink-soft hover:text-laterite"
                          busyLabel="Withdrawing…"
                        >
                          Withdraw
                        </SubmitButton>
                      </form>
                    ) : null}
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState
          title="No requests yet"
          body="Find a boarding you like and send the owner a request with your move-in date. It shows up here with the answer."
          action={<ButtonLink href="/boardings">Browse boardings</ButtonLink>}
        />
      )}
    </div>
  );
}
