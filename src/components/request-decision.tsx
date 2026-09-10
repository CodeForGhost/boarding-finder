"use client";

import { useActionState, useState } from "react";
import { decideRequest } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Decision = "confirmed" | "rejected";

const BUSY_LABEL: Record<Decision, string> = {
  confirmed: "Confirming…",
  rejected: "Declining…",
};

/** Confirm or decline one request, with the reason shown if it is refused. */
export function RequestDecision({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(decideRequest, null);
  // One `pending` covers the whole form, so on its own it cannot say which of
  // the two buttons was pressed - both grey out and neither moves. The click
  // records the answer being sent so only that button spins.
  const [sending, setSending] = useState<Decision | null>(null);

  function decision(value: Decision) {
    const busy = pending && sending === value;
    return {
      name: "decision",
      value,
      onClick: () => setSending(value),
      "aria-busy": busy || undefined,
      // Both buttons lock while one is in flight: confirming a room and
      // declining it are opposite answers to the same request, and the second
      // click must not reach the server behind the first.
      disabled: pending,
      busy,
    };
  }

  return (
    <form action={action} className="flex flex-col items-end gap-2">
      <input type="hidden" name="booking_id" value={bookingId} />
      <div className="flex gap-2">
        {(["rejected", "confirmed"] as const).map((value) => {
          const { busy, ...props } = decision(value);
          return (
            <Button
              key={value}
              type="submit"
              variant={value === "rejected" ? "destructive-soft" : "default"}
              size="sm"
              // A working button is not a switched-off one: the one carrying
              // the request stays at full strength so the spinner reads as
              // progress, while the other correctly fades out.
              className={cn(busy && "disabled:opacity-100")}
              {...props}
            >
              {busy ? <Spinner aria-hidden /> : null}
              {busy ? BUSY_LABEL[value] : value === "rejected" ? "Decline" : "Confirm room"}
            </Button>
          );
        })}
      </div>
      {state?.error ? (
        <p className="max-w-xs text-right text-[0.75rem] text-laterite">{state.error}</p>
      ) : null}
    </form>
  );
}
