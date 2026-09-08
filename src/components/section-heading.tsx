import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl font-bold tracking-tighter text-ink sm:text-[1.75rem]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
