"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { dashboardPath } from "@/lib/session";
import type { Role } from "@/lib/types";

export type FormState = { error?: string } | null;

const SIGNUP_ROLES: Role[] = ["student", "vendor"];

function safeNext(next: FormDataEntryValue | null): string | null {
  const value = typeof next === "string" ? next : "";
  // Only same-origin paths, so a crafted ?next= cannot bounce someone off-site.
  return value.startsWith("/") && !value.startsWith("//") ? value : null;
}

/** Where to land after signing in, when the URL did not say. */
async function homeForCurrentUser(userId: string): Promise<string> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return dashboardPath((data?.role as Role) ?? "student");
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "That email and password do not match an account." };
  }

  redirect(safeNext(formData.get("next")) ?? (await homeForCurrentUser(data.user.id)));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!full_name) return { error: "Enter your name." };
  if (!email.includes("@")) return { error: "Enter a valid email address." };
  if (!phone) return { error: "Enter a phone number so owners can reach you." };
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  if (!SIGNUP_ROLES.includes(role)) {
    return { error: "Choose whether you are looking for a room or listing one." };
  }

  const supabase = await supabaseServer();
  // The handle_new_user trigger turns this metadata into the profile row, and
  // ignores any role other than student or vendor.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, phone, role } },
  });

  if (error) {
    return {
      error: /already/i.test(error.message)
        ? "An account already uses that email. Sign in instead."
        : error.message,
    };
  }
  if (!data.session) {
    return {
      error:
        "Check your email to confirm the account, then sign in. " +
        "To skip this step, turn off email confirmation in Supabase → Authentication → Sign In / Providers.",
    };
  }

  redirect(dashboardPath(role));
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}
