"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ANY } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A plain GET form, so a search lands on a URL a student can send to a friend.
 *
 * Fields left at "any" are switched off a moment before the browser reads the
 * form, which is what keeps `/boardings?area=Kalladi&max=7000` free of empty
 * parameters. Without JavaScript the form still submits; the server drops the
 * "any" values instead.
 *
 * Being a real GET submit, this is a full document navigation - `loading.tsx`
 * never gets a chance to run and React knows nothing about the wait. So the
 * form marks itself `data-submitting` on the way out; `SubmitSpinner` inside
 * it turns that into a spinner on the button. It is the last thing rendered
 * before the browser leaves, which on a slow connection is the difference
 * between a search that answered and one that ignored the tap.
 */
export function SearchForm({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [submitting, setSubmitting] = useState(false);

  // Coming back to a search with the browser's back button restores this page
  // from the bfcache with its React state intact - which without this would be
  // a spinner still turning for a navigation that finished long ago.
  useEffect(() => {
    function restored(event: PageTransitionEvent) {
      if (event.persisted) setSubmitting(false);
    }
    window.addEventListener("pageshow", restored);
    return () => window.removeEventListener("pageshow", restored);
  }, []);

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
    <form
      action="/boardings"
      method="get"
      className={cn("group/search", className)}
      data-submitting={submitting || undefined}
      onSubmit={(event) => {
        dropEmptyFields(event);
        setSubmitting(true);
      }}
    >
      {children}
    </form>
  );
}

/**
 * The spinner for a `SearchForm` submit button. It cannot read the state as a
 * prop - the buttons are composed in from server components - so it watches
 * the form's `data-submitting` attribute instead, and takes up no space until
 * the search is actually on its way.
 */
export function SubmitSpinner({ className }: { className?: string }) {
  return (
    <Spinner
      className={cn("hidden group-data-submitting/search:block", className)}
      aria-hidden
    />
  );
}
