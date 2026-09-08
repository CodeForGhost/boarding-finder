"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ANY } from "@/lib/types";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/**
 * A select whose first option means "no preference". Pairs with `SearchForm`,
 * which strips that value out of the query string.
 */
export function FilterSelect({
  name,
  anyLabel,
  options,
  defaultValue,
  className,
  id,
}: {
  name: string;
  anyLabel: string;
  options: SelectOption[];
  defaultValue?: string;
  className?: string;
  id?: string;
}) {
  return (
    <Select name={name} defaultValue={defaultValue || ANY}>
      <SelectTrigger id={id} className={cn("w-full bg-surface", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ANY}>{anyLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
