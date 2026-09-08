"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createListing, updateListing } from "@/actions/listings";
import { AMENITIES, AREAS, GENDERS } from "@/lib/types";
import type { Boarding } from "@/lib/types";
import { Button, Card } from "./ui";

export function ListingForm({ boarding }: { boarding?: Boarding }) {
  const editing = Boolean(boarding);
  const [state, action, pending] = useActionState(
    editing ? updateListing : createListing,
    null,
  );

  return (
    <form action={action} className="space-y-6">
      {boarding ? <input type="hidden" name="id" value={boarding.id} /> : null}

      <Card className="space-y-5 p-5">
        <p className="eyebrow">The boarding</p>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Title</span>
          <input
            name="title"
            required
            defaultValue={boarding?.title}
            placeholder="Annexe near Puttalam bus stand"
            className="field"
          />
          <span className="mt-1.5 block text-xs text-ink-faint">
            Name it the way a student would describe it to a friend.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Description</span>
          <textarea
            name="description"
            rows={5}
            defaultValue={boarding?.description}
            placeholder="What the rooms are like, what is nearby, and the house rules."
            className="field resize-y"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Area</span>
            <select name="area" className="field" defaultValue={boarding?.area ?? ""} required>
              <option value="" disabled>
                Choose an area
              </option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Boarding for</span>
            <select
              name="gender"
              className="field"
              defaultValue={boarding?.gender ?? "mixed"}
            >
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Address</span>
          <input
            name="address"
            required
            defaultValue={boarding?.address}
            placeholder="142/3 Kurunegala Road, Puttalam"
            className="field"
          />
        </label>
      </Card>

      <Card className="space-y-5 p-5">
        <p className="eyebrow">Rooms and rent</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Rent per month</span>
            <input
              type="number"
              name="price_per_month"
              required
              min={500}
              step={100}
              inputMode="numeric"
              defaultValue={boarding?.price_per_month}
              placeholder="6500"
              className="field font-mono"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Total rooms</span>
            <input
              type="number"
              name="total_rooms"
              required
              min={1}
              defaultValue={boarding?.total_rooms ?? 1}
              className="field font-mono"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Rooms free now</span>
            <input
              type="number"
              name="available_rooms"
              required
              min={0}
              defaultValue={boarding?.available_rooms ?? 1}
              className="field font-mono"
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">What is included</legend>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <label
                key={a}
                className="cursor-pointer rounded-full border border-crust-strong bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-soft transition-colors has-[:checked]:border-lagoon has-[:checked]:bg-lagoon-wash has-[:checked]:text-lagoon-deep"
              >
                <input
                  type="checkbox"
                  name="amenities"
                  value={a}
                  defaultChecked={boarding?.amenities.includes(a)}
                  className="sr-only"
                />
                {a}
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card className="space-y-3 p-5">
        <p className="eyebrow">Photos</p>
        <label className="block">
          <span className="sr-only">Photo links, one per line</span>
          <textarea
            name="images"
            rows={4}
            defaultValue={boarding?.images.join("\n")}
            placeholder={"https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."}
            className="field resize-y font-mono text-[0.75rem]"
          />
        </label>
        <p className="text-xs text-ink-faint">
          One full https:// link per line. The first photo is the one students
          see in the results.
        </p>
      </Card>

      {state?.error ? (
        <p className="rounded-[8px] border border-laterite/25 bg-laterite-wash px-3 py-2 text-sm text-laterite">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Add boarding"}
        </Button>
        <Link
          href="/dashboard/vendor"
          className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
        >
          Cancel
        </Link>
        {!editing ? (
          <span className="ml-auto text-xs text-ink-faint">
            Goes to an admin for approval first.
          </span>
        ) : null}
      </div>
    </form>
  );
}
