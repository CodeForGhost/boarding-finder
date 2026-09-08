"use client";

import { useActionState } from "react";
import { decideRequest } from "@/actions/bookings";
import { Button } from "@/components/ui/button";

/** Confirm or decline one request, with the reason shown if it is refused. */
export function RequestDecision({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(decideRequest, null);

  return (
    <form action={action} className="flex flex-col items-end gap-2">
      <input type="hidden" name="booking_id" value={bookingId} />
      <div className="flex gap-2">
        <Button
          type="submit"
          name="decision"
          value="rejected"
          variant="destructive-soft"
          size="sm"
          disabled={pending}
        >
          Decline
        </Button>
        <Button type="submit" name="decision" value="confirmed" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Confirm room"}
        </Button>
      </div>
      {state?.error ? (
        <p className="max-w-xs text-right text-[0.75rem] text-laterite">{state.error}</p>
      ) : null}
    </form>
  );
}
