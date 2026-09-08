import Image from "next/image";
import Link from "next/link";
import { rupees } from "@/lib/format";
import type { Boarding } from "@/lib/types";
import { genderLabel } from "@/lib/types";
import { RoomTally } from "./ui";

export function BoardingCard({
  boarding,
  priority = false,
}: {
  boarding: Boarding;
  priority?: boolean;
}) {
  const cover = boarding.images[0];
  const full = boarding.available_rooms === 0;

  return (
    <Link
      href={`/boardings/${boarding.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-crust bg-surface transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-crust-strong hover:shadow-[0_10px_30px_-18px_rgba(13,31,27,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-crust">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-soft backdrop-blur">
          {boarding.area}
        </span>
        {full ? (
          <span className="absolute right-3 top-3 rounded-full bg-laterite px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-white">
            Full
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 rounded-[8px] bg-ink/90 px-2.5 py-1.5 font-mono text-[0.8125rem] font-medium text-salt backdrop-blur">
          {rupees(boarding.price_per_month)}
          <span className="text-ink-faint">/mo</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-tight text-ink">
          {boarding.title}
        </h3>
        <p className="line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-soft">
          {boarding.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-crust pt-3">
          <RoomTally total={boarding.total_rooms} available={boarding.available_rooms} />
          <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-faint">
            {genderLabel(boarding.gender)}
          </span>
        </div>
      </div>
    </Link>
  );
}
