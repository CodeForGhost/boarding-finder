"use client";

import { useActionState, useState } from "react";
import { signUp } from "@/actions/auth";
import { Button, cx } from "./ui";

const ROLE_CHOICES = [
  {
    value: "student",
    label: "I need a room",
    note: "Search boardings and send requests.",
  },
  {
    value: "vendor",
    label: "I have rooms to let",
    note: "List a boarding and answer requests.",
  },
] as const;

export function RegisterForm({ initialRole }: { initialRole?: string }) {
  const [state, action, pending] = useActionState(signUp, null);
  const [role, setRole] = useState<string>(
    initialRole === "vendor" ? "vendor" : "student",
  );

  return (
    <form action={action} className="space-y-5">
      <fieldset>
        <legend className="eyebrow mb-2">I am here to</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLE_CHOICES.map((c) => (
            <label
              key={c.value}
              className={cx(
                "cursor-pointer rounded-card border p-3.5 transition-colors",
                role === c.value
                  ? "border-lagoon bg-lagoon-wash"
                  : "border-crust-strong bg-surface hover:border-ink-faint",
              )}
            >
              <input
                type="radio"
                name="role"
                value={c.value}
                checked={role === c.value}
                onChange={() => setRole(c.value)}
                className="sr-only"
              />
              <span className="block text-sm font-medium text-ink">{c.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                {c.note}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="eyebrow mb-1.5 block">Full name</span>
        <input name="full_name" required autoComplete="name" className="field" placeholder="Ashan Fernando" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-1.5 block">Email</span>
          <input type="email" name="email" required autoComplete="email" className="field" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="eyebrow mb-1.5 block">Phone</span>
          <input name="phone" required autoComplete="tel" className="field" placeholder="07X XXX XXXX" />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow mb-1.5 block">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
          placeholder="At least 8 characters"
        />
      </label>

      {state?.error ? (
        <p className="rounded-[8px] border border-laterite/25 bg-laterite-wash px-3 py-2 text-sm text-laterite">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
