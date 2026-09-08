import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { approveListing, rejectListing } from "@/actions/admin";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ListingStatusBadge,
  RoomTally,
  SectionHeading,
} from "@/components/ui";
import { getAdminStats, getAreaBreakdown, getBoardingsByStatus } from "@/lib/data";
import { plural, rupees, timeAgo } from "@/lib/format";
import { requireRole } from "@/lib/session";
import { genderLabel } from "@/lib/types";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminDashboard() {
  await requireRole("admin");

  const stats = await getAdminStats();
  const queue = await getBoardingsByStatus("pending");
  const rejected = await getBoardingsByStatus("rejected");
  const areas = (await getAreaBreakdown())
    .slice()
    .sort((a, b) => b.rooms - a.rooms);
  // The bar measures rooms free, which is what a student can actually take.
  const mostRooms = Math.max(1, areas[0]?.rooms ?? 1);

  const cards = [
    { label: "Students", value: stats.students, note: "registered" },
    { label: "Boarding owners", value: stats.vendors, note: "registered" },
    { label: "Live listings", value: stats.listings, note: `${stats.rooms_available} rooms free` },
    { label: "Booking requests", value: stats.bookings, note: `${stats.pending_bookings} waiting` },
  ];

  return (
    <div className="space-y-12">
      <section>
        <SectionHeading eyebrow="Administrator" title="Platform overview" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label} className="p-4">
              <p className="font-mono text-3xl font-medium leading-none tracking-tight text-lagoon-deep">
                {c.value}
              </p>
              <p className="mt-2 text-sm font-medium text-ink">{c.label}</p>
              <p className="eyebrow mt-0.5">{c.note}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Approval queue */}
      <section id="queue">
        <SectionHeading
          eyebrow="Approvals"
          title={
            queue.length
              ? `${plural(queue.length, "listing")} waiting for review`
              : "Approval queue"
          }
        />

        {queue.length ? (
          <ul className="space-y-3">
            {queue.map((b) => (
              <li key={b.id}>
                <Card className="overflow-hidden">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row">
                    <Link
                      href={`/boardings/${b.id}`}
                      className="relative h-32 shrink-0 overflow-hidden rounded-[10px] bg-crust sm:h-28 sm:w-40"
                    >
                      {b.images[0] ? (
                        <Image src={b.images[0]} alt="" fill sizes="160px" className="object-cover" />
                      ) : null}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/boardings/${b.id}`}
                        className="font-display font-semibold leading-snug text-ink transition-colors hover:text-lagoon"
                      >
                        {b.title}
                      </Link>
                      <p className="eyebrow mt-1">
                        {b.area} · {rupees(b.price_per_month)}/mo · {genderLabel(b.gender)}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-soft">
                        {b.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <RoomTally total={b.total_rooms} available={b.available_rooms} />
                        <span className="font-mono text-[0.75rem] text-ink-faint">
                          {b.vendor_name} · {b.vendor_phone}
                        </span>
                        <span className="font-mono text-[0.75rem] text-ink-faint">
                          submitted {timeAgo(b.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:justify-center">
                      <form action={approveListing}>
                        <input type="hidden" name="id" value={b.id} />
                        <Button type="submit" size="sm" className="w-full">
                          Approve
                        </Button>
                      </form>
                      <form action={rejectListing}>
                        <input type="hidden" name="id" value={b.id} />
                        <Button type="submit" variant="danger" size="sm" className="w-full">
                          Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Queue is clear"
            body="Every listing owners have submitted is either live or rejected. New submissions appear here."
          />
        )}
      </section>

      {/* Where the rooms are */}
      <section>
        <SectionHeading eyebrow="Coverage" title="Where the rooms are" />
        <Card className="divide-y divide-crust">
          {areas.map((a) => (
            <div key={a.area} className="flex items-center gap-4 px-4 py-3">
              <span className="w-40 shrink-0 truncate text-sm text-ink">{a.area}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-salt">
                <div
                  className="h-full rounded-full bg-lagoon"
                  style={{ width: `${Math.round((a.rooms / mostRooms) * 100)}%` }}
                />
              </div>
              <span className="w-36 shrink-0 text-right font-mono text-[0.75rem] text-ink-soft">
                {plural(a.rooms, "room")} · {a.listings} listed
              </span>
            </div>
          ))}
          {areas.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-faint">
              No approved listings yet.
            </p>
          ) : null}
        </Card>
        <p className="mt-3 text-xs text-ink-faint">
          Typical rent across live listings is {rupees(stats.median_price)} a month.
        </p>
      </section>

      {rejected.length ? (
        <section>
          <SectionHeading eyebrow="History" title="Rejected listings" />
          <Card className="divide-y divide-crust">
            {rejected.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{b.title}</p>
                  <p className="eyebrow mt-0.5">
                    {b.area} · {b.vendor_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ListingStatusBadge status="rejected" />
                  <form action={approveListing}>
                    <input type="hidden" name="id" value={b.id} />
                    <Button type="submit" variant="outline" size="sm">
                      Put it live
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </Card>
        </section>
      ) : (
        <section>
          <SectionHeading eyebrow="History" title="Rejected listings" />
          <Card className="px-4 py-6">
            <Badge tone="good">None</Badge>
            <p className="mt-2 text-sm text-ink-soft">
              Nothing has been rejected. Rejected listings show up here so an
              owner can be given a second look.
            </p>
          </Card>
        </section>
      )}
    </div>
  );
}
