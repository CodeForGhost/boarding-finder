"use client";

import { useActionState, useState } from "react";
import { signIn } from "@/actions/auth";
import { Button, cx } from "./ui";

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

        <label className="block">
          <span className="eyebrow mb-1.5 block">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="eyebrow mb-1.5 block">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="Your password"
          />
        </label>

        {state?.error ? (
          <p className="rounded-[8px] border border-laterite/25 bg-laterite-wash px-3 py-2 text-sm text-laterite">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {/* Demo accounts — one tap fills the form so nobody types on stage. */}
      <div className="rounded-card border border-dashed border-crust-strong bg-surface p-4">
        <p className="eyebrow mb-3">Demo accounts</p>
        <div className="space-y-1.5">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword(DEMO_PASSWORD);
              }}
              className={cx(
                "flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left transition-colors",
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
      </div>
    </div>
  );
}
