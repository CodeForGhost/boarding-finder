"use client";

import type { FormEvent, ReactNode } from "react";
import { ANY } from "@/lib/types";

/**
 * A plain GET form, so a search lands on a URL a student can send to a friend.
 *
 * Fields left at "any" are switched off a moment before the browser reads the
 * form, which is what keeps `/boardings?area=Kalladi&max=7000` free of empty
 * parameters. Without JavaScript the form still submits; the server drops the
 * "any" values instead.
 */
export function SearchForm({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  function dropEmptyFields(event: FormEvent<HTMLFormElement>) {
    for (const el of Array.from(event.currentTarget.elements)) {
      const field = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!("value" in field) || !field.name) continue;
      if (field instanceof HTMLInputElement && field.type === "radio" && !field.checked) {
        continue;
      }
      if (!field.value.trim() || field.value === ANY) field.disabled = true;
    }
  }

  return (
    <form action="/boardings" method="get" className={className} onSubmit={dropEmptyFields}>
      {children}
    </form>
  );
}
