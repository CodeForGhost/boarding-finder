"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createListing, updateListing } from "@/actions/listings";
import { FormError } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AMENITIES, AREAS, GENDERS } from "@/lib/types";
import type { Boarding } from "@/lib/types";

export function ListingForm({ boarding }: { boarding?: Boarding }) {
  const editing = Boolean(boarding);
  const [state, action, pending] = useActionState(
    editing ? updateListing : createListing,
    null,
  );

  return (
    <form action={action} className="space-y-6">
      {boarding ? <input type="hidden" name="id" value={boarding.id} /> : null}

      <Card className="gap-5">
        <CardHeader>
          <p className="eyebrow">The boarding</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={boarding?.title}
              placeholder="Annexe near Puttalam bus stand"
            />
            <p className="text-xs text-ink-faint">
              Name it the way a student would describe it to a friend.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={boarding?.description}
              placeholder="What the rooms are like, what is nearby, and the house rules."
              className="resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="area">Area</Label>
              {/* No `required` here: the control the browser would report on is
                  visually hidden, so the area check lives in the server action
                  and comes back as a message the owner can see. */}
              <Select name="area" defaultValue={boarding?.area}>
                <SelectTrigger id="area" className="w-full">
                  <SelectValue placeholder="Choose an area" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Boarding for</Label>
              {/* No default: a boarding takes men or women, and guessing on
                  the owner's behalf is how a listing goes live saying the
                  wrong one. The server action refuses a blank. */}
              <Select name="gender" defaultValue={boarding?.gender}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Choose who it is for" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              required
              defaultValue={boarding?.address}
              placeholder="142/3 Kurunegala Road, Puttalam"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-5">
        <CardHeader>
          <p className="eyebrow">Rooms and rent</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Rent per month</Label>
              <Input
                id="price"
                type="number"
                name="price_per_month"
                required
                min={500}
                step={100}
                inputMode="numeric"
                defaultValue={boarding?.price_per_month}
                placeholder="6500"
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="total-rooms">Total rooms</Label>
              <Input
                id="total-rooms"
                type="number"
                name="total_rooms"
                required
                min={1}
                defaultValue={boarding?.total_rooms ?? 1}
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="available-rooms">Rooms free now</Label>
              <Input
                id="available-rooms"
                type="number"
                name="available_rooms"
                required
                min={0}
                defaultValue={boarding?.available_rooms ?? 1}
                className="font-mono"
              />
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">
              What is included
            </legend>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <Label
                  key={a}
                  htmlFor={`amenity-${a}`}
                  className="cursor-pointer rounded-full border border-crust-strong bg-surface px-3 py-1.5 text-[0.8125rem] font-normal text-ink-soft transition-colors has-[[data-state=checked]]:border-lagoon has-[[data-state=checked]]:bg-lagoon-wash has-[[data-state=checked]]:text-lagoon-deep"
                >
                  <Checkbox
                    id={`amenity-${a}`}
                    name="amenities"
                    value={a}
                    defaultChecked={boarding?.amenities.includes(a)}
                    className="size-3.5"
                  />
                  {a}
                </Label>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <Card className="gap-3">
        <CardHeader>
          <p className="eyebrow">Photos</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="images" className="sr-only">
            Photo links, one per line
          </Label>
          <Textarea
            id="images"
            name="images"
            rows={4}
            defaultValue={boarding?.images.join("\n")}
            placeholder={"https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."}
            className="resize-y font-mono text-[0.75rem]"
          />
          <p className="text-xs text-ink-faint">
            One full https:// link per line. The first photo is the one students
            see in the results.
          </p>
        </CardContent>
      </Card>

      <FormError>{state?.error}</FormError>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving..." : editing ? "Save changes" : "Add boarding"}
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
