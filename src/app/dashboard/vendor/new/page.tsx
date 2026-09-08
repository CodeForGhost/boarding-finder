import type { Metadata } from "next";
import { ListingForm } from "@/components/listing-form";
import { SectionHeading } from "@/components/ui";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Add a boarding" };

export default async function NewListingPage() {
  await requireRole("vendor");
  return (
    <div>
      <SectionHeading eyebrow="New listing" title="Add a boarding" />
      <ListingForm />
    </div>
  );
}
