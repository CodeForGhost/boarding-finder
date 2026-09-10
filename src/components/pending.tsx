"use client";

import { useLinkStatus } from "next/link";
import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * A tap on a link that loads a server-rendered page can sit silent for a
 * second on a phone, and the second tap is the one that makes a student think
 * the screen is broken. This renders nothing until the navigation it sits
 * inside is actually pending, so it costs nothing on a fast connection.
 *
 * It must be a descendant of the `<Link>` it reports on.
 */
export function LinkSpinner({ className, ...props }: ComponentProps<typeof Spinner>) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  // Nothing else on the card announces the wait, so the spinner keeps the
  // role="status" and "Loading" label it ships with.
  return <Spinner className={cn("shrink-0", className)} {...props} />;
}

/**
 * The submit button for a form that posts to a server action.
 *
 * `useFormStatus` reads the pending state of the form this button sits in, so
 * a server component can hand off the busy state without becoming a client
 * component itself. That matters here: approving a listing, deleting one and
 * signing out are all plain forms inside server-rendered pages, and until now
 * none of them answered the click at all.
 *
 * Pass `busyLabel` when the work is worth naming ("Approving…"); the spinner
 * says something is happening, the label says what.
 */
export function SubmitButton({
  children,
  busyLabel,
  disabled,
  className,
  ...props
}: ComponentProps<typeof Button> & { busyLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      aria-busy={pending || undefined}
      disabled={disabled || pending}
      className={cn(
        // A working button is not a switched-off one: hold it at full strength
        // so the spinner reads as progress rather than as a dead control.
        pending && "disabled:opacity-100",
        className,
      )}
      {...props}
    >
      {pending ? <Spinner aria-hidden /> : null}
      {pending && busyLabel ? busyLabel : children}
    </Button>
  );
}
