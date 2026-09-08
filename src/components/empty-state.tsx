import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-crust-strong bg-surface/60 px-6 py-14 text-center">
      <p className="font-display text-lg font-bold tracking-tighter text-ink">
        {title}
      </p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-soft">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
