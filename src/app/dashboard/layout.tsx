import { DashboardNav, type NavItem } from "@/components/dashboard-nav";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminStats, getStudentBookings, getVendorBookings } from "@/lib/data";
import { requireUser } from "@/lib/session";

const ROLE_LABEL = {
  student: "Student",
  vendor: "Boarding owner",
  admin: "Administrator",
} as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/dashboard");

  let items: NavItem[] = [];
  if (user.role === "student") {
    const waiting = (await getStudentBookings(user.id)).filter(
      (b) => b.status === "pending",
    ).length;
    items = [
      { href: "/dashboard/student", label: "My requests", count: waiting },
      { href: "/boardings", label: "Browse rooms" },
    ];
  } else if (user.role === "vendor") {
    const waiting = (await getVendorBookings(user.id)).filter(
      (b) => b.status === "pending",
    ).length;
    items = [
      { href: "/dashboard/vendor", label: "Listings and requests", count: waiting },
      { href: "/dashboard/vendor/new", label: "Add a boarding" },
      { href: "/boardings", label: "Browse rooms" },
    ];
  } else {
    const stats = await getAdminStats();
    items = [
      { href: "/dashboard/admin", label: "Overview", count: stats.pending_listings },
      { href: "/boardings", label: "Browse rooms" },
    ];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="mb-4 gap-0 py-4">
              <CardContent className="px-4">
                <p className="eyebrow">{ROLE_LABEL[user.role]}</p>
                <p className="mt-1 font-display leading-tight font-bold tracking-tighter text-ink">
                  {user.full_name}
                </p>
                <p className="mt-0.5 font-mono text-[0.6875rem] break-all text-ink-faint">
                  {user.email}
                </p>
              </CardContent>
            </Card>
            <DashboardNav items={items} />
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
