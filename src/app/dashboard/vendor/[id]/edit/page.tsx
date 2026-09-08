import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/listing-form";
import { SectionHeading } from "@/components/section-heading";
import { ListingStatusBadge } from "@/components/status-badge";
import { getBoarding } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Edit boarding" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const vendor = await requireRole("vendor");
  const { id } = await params;
  const boarding = await getBoarding(id);

  if (!boarding || boarding.vendor_id !== vendor.id) notFound();

  return (
    <div>
      <SectionHeading
        eyebrow="Edit listing"
        title={boarding.title}
        action={<ListingStatusBadge status={boarding.status} />}
      />
      <ListingForm boarding={boarding} />
    </div>
  );
}
