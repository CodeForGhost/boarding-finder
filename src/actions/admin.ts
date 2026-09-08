"use server";

import { revalidatePath } from "next/cache";
import { setBoardingStatus } from "@/lib/data";
import { requireRole } from "@/lib/session";

export async function approveListing(formData: FormData) {
  await requireRole("admin");
  await setBoardingStatus(String(formData.get("id") ?? ""), "approved");
  revalidatePath("/dashboard/admin");
  revalidatePath("/boardings");
  revalidatePath("/");
}

export async function rejectListing(formData: FormData) {
  await requireRole("admin");
  await setBoardingStatus(String(formData.get("id") ?? ""), "rejected");
  revalidatePath("/dashboard/admin");
  revalidatePath("/boardings");
}
