import Link from "next/link";
import type { ComponentProps } from "react";
import { LinkSpinner } from "@/components/pending";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

/**
 * A link that looks like a button. Every navigation in the app is a real
 * anchor, so middle-click and "open in new tab" keep working.
 *
 * It spins while the page it points at is being fetched: these are the app's
 * calls to action, and on a phone the tap is otherwise answered by nothing at
 * all until the new screen arrives.
 */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> &
  Pick<ButtonProps, "variant" | "size" | "className">) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link {...props}>
        <LinkSpinner />
        {children}
      </Link>
    </Button>
  );
}
