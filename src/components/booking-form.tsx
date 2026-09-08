"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestBooking } from "@/actions/bookings";
import { Button } from "./ui";

const DURATIONS = [3, 6, 9, 12, 24];

export function BookingForm({
  boardingId,
  minDate,
  canRequest,
  reason,
}: {
  boardingId: string;
  minDate: string;
  canRequest: boolean;
  /** Why the form is closed, when it is. */
  reason?: { text: string; href?: string; cta?: string };
}) {
  const [state, action, pending] = useActionState(requestBooking, null);

  if (!canRequest && reason) {
    return (
      <div className="rounded-[10px] border border-crust bg-salt p-4 text-sm text-ink-soft">
        <p>{reason.text}</p>
        {reason.href && reason.cta ? (
          <Link
            href={reason.href}
            className="mt-2 inline-block font-medium text-lagoon underline underline-offset-4"
          >
            {reason.cta}
          </Link>
        ) : null}
      </div>
    );
  }

  if (state?.ok) {
    return (
      <div className="rounded-[10px] border border-lagoon/25 bg-lagoon-wash p-4">
        <p className="font-display font-semibold text-lagoon-deep">Request sent</p>
        <p className="mt-1 text-sm text-ink-soft">
          The owner sees it on their dashboard. You will see the answer under
          your requests.
        </p>
        <Link
          href="/dashboard/student"
          className="mt-3 inline-block text-sm font-medium text-lagoon underline underline-offset-4"
        >
          Go to my requests
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="boarding_id" value={boardingId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-1.5 block">Move in</span>
          <input
            type="date"
            name="move_in_date"
            required
            min={minDate}
            defaultValue={minDate}
            className="field font-mono text-[0.8125rem]"
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-1.5 block">For how long</span>
          <select name="duration_months" className="field" defaultValue={6}>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} months
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="eyebrow mb-1.5 block">Message to the owner</span>
        <textarea
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Tell the owner what you study and when you can come to see the room."
          className="field resize-y"
        />
      </label>

      {state?.error ? (
        <p className="rounded-[8px] border border-laterite/25 bg-laterite-wash px-3 py-2 text-sm text-laterite">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Request this room"}
      </Button>
      <p className="text-center text-xs text-ink-faint">
        No payment now. The owner replies with a yes or no.
      </p>
    </form>
  );
}
