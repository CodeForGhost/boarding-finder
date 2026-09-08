import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/** What went wrong with a submitted form, in the form's own voice. */
export function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <Alert
      variant="destructive"
      className="border-laterite/25 bg-laterite-wash py-2.5"
    >
      <AlertCircleIcon />
      <AlertDescription className="text-destructive">{children}</AlertDescription>
    </Alert>
  );
}
