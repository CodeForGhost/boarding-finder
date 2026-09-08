"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestBooking } from "@/actions/bookings";
import { FormError } from "@/components/form-message";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      <Alert className="border-crust bg-salt">
        <AlertDescription className="text-ink-soft">
          <p>{reason.text}</p>
          {reason.href && reason.cta ? (
            <Link
              href={reason.href}
              className="font-medium text-lagoon underline underline-offset-4"
            >
              {reason.cta}
            </Link>
          ) : null}
        </AlertDescription>
      </Alert>
    );
  }

  if (state?.ok) {
    return (
      <Alert className="border-lagoon/25 bg-lagoon-wash">
        <AlertDescription className="text-ink-soft">
          <p className="font-display font-bold tracking-tighter text-lagoon-deep">
            Request sent
          </p>
          <p>
            The owner sees it on their dashboard. You will see the answer under
            your requests.
          </p>
          <Link
            href="/dashboard/student"
            className="mt-1 text-sm font-medium text-lagoon underline underline-offset-4"
          >
            Go to my requests
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="boarding_id" value={boardingId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="move-in" className="eyebrow">
            Move in
          </Label>
          <Input
            id="move-in"
            type="date"
            name="move_in_date"
            required
            min={minDate}
            defaultValue={minDate}
            className="bg-surface font-mono text-[0.8125rem]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration" className="eyebrow">
            For how long
          </Label>
          <Select name="duration_months" defaultValue="6">
            <SelectTrigger id="duration" className="w-full bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} months
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="eyebrow">
          Message to the owner
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Tell the owner what you study and when you can come to see the room."
          className="resize-y bg-surface"
        />
      </div>

      <FormError>{state?.error}</FormError>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Request this room"}
      </Button>
      <p className="text-center text-xs text-ink-faint">
        No payment now. The owner replies with a yes or no.
      </p>
    </form>
  );
}
