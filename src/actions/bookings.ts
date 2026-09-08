"use server";

import { revalidatePath } from "next/cache";
import {
  cancelBooking,
  createBooking,
  decideBooking,
  getBoarding,
  hasOpenRequest,
} from "@/lib/data";
import { getUser, requireRole } from "@/lib/session";

export type RequestState = { error?: string; ok?: boolean } | null;

export async function requestBooking(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const user = await getUser();
  if (!user) return { error: "Sign in as a student to request a room." };
  if (user.role !== "student") {
    return { error: "Only student accounts can request a room." };
  }

  const boarding_id = String(formData.get("boarding_id") ?? "");
  const move_in_date = String(formData.get("move_in_date") ?? "");
  const duration_months = Number(formData.get("duration_months") ?? 0);
  const message = String(formData.get("message") ?? "").trim();

  const boarding = await getBoarding(boarding_id);
  if (!boarding || boarding.status !== "approved") {
    return { error: "That boarding is not taking requests." };
  }
  if (boarding.available_rooms < 1) {
    return { error: "This boarding is full. Try another one in the same area." };
  }
  if (!move_in_date) return { error: "Pick the date you want to move in." };
  if (!Number.isInteger(duration_months) || duration_months < 1) {
    return { error: "Say how many months you need the room for." };
  }
  if (await hasOpenRequest(boarding_id, user.id)) {
    return { error: "You already have a request waiting on this boarding." };
  }

  await createBooking({
    boarding_id,
    student_id: user.id,
    move_in_date,
    duration_months,
    message,
  });

  revalidatePath(`/boardings/${boarding_id}`);
  revalidatePath("/dashboard/student");
  return { ok: true };
}

/** Vendor answers one request. `decision` comes from the button that was pressed. */
export async function decideRequest(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const vendor = await requireRole("vendor");
  const id = String(formData.get("booking_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (decision !== "confirmed" && decision !== "rejected") {
    return { error: "Choose confirm or decline." };
  }

  const result = await decideBooking(id, vendor.id, decision);
  if (!result.ok) return { error: result.error };

  revalidatePath("/dashboard/vendor");
  revalidatePath("/boardings");
  return { ok: true };
}

export async function withdrawRequest(formData: FormData) {
  const student = await requireRole("student");
  const id = String(formData.get("booking_id") ?? "");
  await cancelBooking(id, student.id);
  revalidatePath("/dashboard/student");
}
