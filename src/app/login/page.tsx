import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { dashboardPath, getUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getUser();
  if (user) redirect(dashboardPath(user.role));

  const { next } = await searchParams;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      blurb="Students track their requests here. Owners answer them."
      footer={
        <>
          No account yet?{" "}
          <Link href="/register" className="font-medium text-lagoon underline underline-offset-4">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm next={safeNext} />
    </AuthShell>
  );
}
