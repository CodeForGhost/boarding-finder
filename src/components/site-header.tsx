import Link from "next/link";
import { signOut } from "@/actions/auth";
import { ButtonLink } from "@/components/button-link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/session";
import { Logo, Wordmark } from "./logo";

/** "M. Nizam" is initial-plus-name, so the first word is not always the name. */
function firstName(full: string): string {
  const parts = full.trim().split(/\s+/);
  return parts.find((p) => p.replace(/\W/g, "").length > 1) ?? parts[0] ?? "";
}

export async function SiteHeader() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-crust bg-salt/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-7">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-ink-soft sm:flex">
            <Link href="/boardings" className="transition-colors hover:text-lagoon">
              Browse rooms
            </Link>
            {user?.role !== "student" && user?.role !== "admin" ? (
              <Link
                href={user ? "/dashboard/vendor/new" : "/register?role=vendor"}
                className="transition-colors hover:text-lagoon"
              >
                List a boarding
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <ButtonLink href={`/dashboard/${user.role}`} variant="outline" size="sm">
                <span className="sm:hidden">Dashboard</span>
                <span className="hidden sm:inline">
                  {firstName(user.full_name)}&rsquo;s dashboard
                </span>
              </ButtonLink>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                Create account
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-crust bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-1.5">
          <Wordmark className="text-[0.9375rem]" />
          <span>built for students in the North Western Province.</span>
        </p>
        <p className="eyebrow">Demo build · FocalDive</p>
      </div>
    </footer>
  );
}
