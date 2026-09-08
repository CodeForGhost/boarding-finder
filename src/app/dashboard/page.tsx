import { redirect } from "next/navigation";
import { dashboardPath, requireUser } from "@/lib/session";

export default async function DashboardIndex() {
  const user = await requireUser("/dashboard");
  redirect(dashboardPath(user.role));
}
