import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

/**
 * A link that looks like a button. Every navigation in the app is a real
 * anchor, so middle-click and "open in new tab" keep working.
 */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> &
  Pick<ButtonProps, "variant" | "size" | "className">) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link {...props} />
    </Button>
  );
}
