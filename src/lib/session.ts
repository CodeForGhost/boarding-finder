import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";
import type { Profile, Role } from "./types";

/**
 * The signed-in profile, or null.
 *
 * getUser() revalidates the token with Supabase rather than trusting the
 * cookie, so this is safe to gate pages on. The role lives on the profile row,
 * not in the JWT, which keeps a stale token from carrying a stale role.
 */
export async function getUser(): Promise<Profile | null> {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return (profile as Profile | null) ?? null;
}

/** The signed-in profile, or a redirect to /login. */
export async function requireUser(returnTo?: string): Promise<Profile> {
  const user = await getUser();
  if (!user) {
    redirect(returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login");
  }
  return user;
}

/** The signed-in profile with one of `roles`, or a redirect. */
export async function requireRole(...roles: Role[]): Promise<Profile> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(dashboardPath(user.role));
  return user;
}

export function dashboardPath(role: Role): string {
  return `/dashboard/${role}`;
}
