"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBoarding,
  deleteBoarding,
  getBoarding,
  updateBoarding,
  type BoardingInput,
} from "@/lib/data";
import { requireRole } from "@/lib/session";
import { AMENITIES, AREAS, type Gender } from "@/lib/types";

export type ListingState = { error?: string } | null;

const GENDERS: Gender[] = ["male", "female"];

function parse(formData: FormData): { input: BoardingInput } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const gender = String(formData.get("gender") ?? "") as Gender;
  const price = Number(formData.get("price_per_month"));
  const total = Number(formData.get("total_rooms"));
  const available = Number(formData.get("available_rooms"));

  const amenities = formData
    .getAll("amenities")
    .map(String)
    .filter((a) => (AMENITIES as readonly string[]).includes(a));

  const images = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (title.length < 4) return { error: "Give the boarding a title students will recognise." };
  if (!(AREAS as readonly string[]).includes(area)) return { error: "Pick the area the boarding is in." };
  if (!address) return { error: "Add the street address." };
  if (!GENDERS.includes(gender)) return { error: "Say who the boarding is for." };
  if (!Number.isFinite(price) || price < 500) return { error: "Enter the monthly rent in rupees." };
  if (!Number.isInteger(total) || total < 1) return { error: "A boarding needs at least one room." };
  if (!Number.isInteger(available) || available < 0) return { error: "Free rooms cannot be negative." };
  if (available > total) return { error: "Free rooms cannot be more than total rooms." };
  if (images.some((u) => !/^https?:\/\//i.test(u))) {
    return { error: "Each photo needs to be a full https:// link, one per line." };
  }

  return {
    input: {
      title,
      description,
      area,
      address,
      gender,
      price_per_month: Math.round(price),
      total_rooms: total,
      available_rooms: available,
      amenities,
      images,
    },
  };
}

export async function createListing(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const vendor = await requireRole("vendor");
  const parsed = parse(formData);
  if ("error" in parsed) return { error: parsed.error };

  await createBoarding(vendor.id, parsed.input);
  revalidatePath("/dashboard/vendor");
  revalidatePath("/dashboard/admin");
  redirect("/dashboard/vendor?added=1");
}

export async function updateListing(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const vendor = await requireRole("vendor");
  const id = String(formData.get("id") ?? "");
  const parsed = parse(formData);
  if ("error" in parsed) return { error: parsed.error };

  const existing = await getBoarding(id);
  if (!existing || existing.vendor_id !== vendor.id) {
    return { error: "That listing is not yours to edit." };
  }

  await updateBoarding(id, vendor.id, parsed.input, existing.status);
  revalidatePath("/dashboard/vendor");
  revalidatePath(`/boardings/${id}`);
  redirect("/dashboard/vendor?saved=1");
}

export async function deleteListing(formData: FormData) {
  const vendor = await requireRole("vendor");
  const id = String(formData.get("id") ?? "");
  await deleteBoarding(id, vendor.id);
  revalidatePath("/dashboard/vendor");
  revalidatePath("/boardings");
}
