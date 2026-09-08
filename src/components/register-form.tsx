"use client";

import { useActionState, useState } from "react";
import { signUp } from "@/actions/auth";
import { FormError } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

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
        <RadioGroup
          name="role"
          value={role}
          onValueChange={setRole}
          className="grid gap-2 sm:grid-cols-2"
        >
          {ROLE_CHOICES.map((c) => (
            <Label
              key={c.value}
              htmlFor={`role-${c.value}`}
              className={cn(
                "cursor-pointer items-start gap-3 rounded-card border p-3.5 font-normal transition-colors",
                role === c.value
                  ? "border-lagoon bg-lagoon-wash"
                  : "border-crust-strong bg-surface hover:border-ink-faint",
              )}
            >
              <RadioGroupItem id={`role-${c.value}`} value={c.value} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-ink">{c.label}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                  {c.note}
                </span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="eyebrow">
          Full name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          required
          autoComplete="name"
          className="bg-surface"
          placeholder="Ashan Fernando"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="eyebrow">
            Email
          </Label>
          <Input
            id="reg-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            className="bg-surface"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="eyebrow">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            required
            autoComplete="tel"
            className="bg-surface"
            placeholder="07X XXX XXXX"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password" className="eyebrow">
          Password
        </Label>
        <Input
          id="reg-password"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="bg-surface"
          placeholder="At least 8 characters"
        />
      </div>

      <FormError>{state?.error}</FormError>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
