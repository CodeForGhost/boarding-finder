"use client";

import { useActionState, useState } from "react";
import { signIn } from "@/actions/auth";
import { FormError } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DEMO = [
  { role: "Student", email: "student@demo.lk", note: "Ashan, looking in Puttalam Town" },
  { role: "Owner", email: "vendor@demo.lk", note: "Nizam, four boardings listed" },
  { role: "Admin", email: "admin@demo.lk", note: "Rizna, approves new listings" },
];

const DEMO_PASSWORD = "demo1234";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="eyebrow">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="eyebrow">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface"
            placeholder="Your password"
          />
        </div>

        <FormError>{state?.error}</FormError>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Demo accounts: one tap fills the form so nobody types on stage. */}
      <Card className="gap-3 border-dashed border-crust-strong py-4">
        <div className="px-4">
          <p className="eyebrow">Demo accounts</p>
        </div>
        <div className="space-y-1.5 px-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword(DEMO_PASSWORD);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                email === d.email ? "bg-lagoon-wash" : "hover:bg-salt",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-ink">{d.role}</span>
                <span className="block text-xs text-ink-faint">{d.note}</span>
              </span>
              <span className="shrink-0 font-mono text-[0.6875rem] text-lagoon">
                {email === d.email ? "filled" : "use"}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
