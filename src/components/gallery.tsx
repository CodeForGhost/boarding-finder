"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) {
    return <div className="aspect-[16/10] rounded-card border border-crust bg-crust" />;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-crust bg-crust">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 680px, 96vw"
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={cn(
                "relative h-16 w-24 overflow-hidden rounded-lg border transition-colors",
                i === active
                  ? "border-lagoon ring-2 ring-lagoon/25"
                  : "border-crust hover:border-crust-strong",
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
