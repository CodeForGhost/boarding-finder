import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";
import { dashboardPath, getUser } from "@/lib/session";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const user = await getUser();
  if (user) redirect(dashboardPath(user.role));

  const { role } = await searchParams;

  return (
    <AuthShell
      eyebrow="New here"
      title="Create an account"
      blurb="One account, two ways to use it. Pick the one that describes you."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-medium text-lagoon underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm initialRole={role} />
    </AuthShell>
  );
}
