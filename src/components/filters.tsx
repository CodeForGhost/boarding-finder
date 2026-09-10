import Link from "next/link";
import { FilterSelect } from "@/components/filter-select";
import { SearchForm, SubmitSpinner } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ANY, AREAS, GENDERS } from "@/lib/types";

export type ActiveFilters = {
  area?: string;
  max?: string;
  min?: string;
  gender?: string;
  q?: string;
  sort?: string;
};

const BUDGETS = [4000, 5000, 6000, 7000, 8000, 9000];

export function Filters({ active }: { active: ActiveFilters }) {
  const isFiltered = Boolean(
    active.area || active.max || active.min || active.gender || active.q,
  );

  return (
    <SearchForm className="space-y-6">
      {/* Carried through so applying a filter does not silently reset the sort.
          "recent" is the default and stays out of the URL. */}
      {active.sort && active.sort !== "recent" ? (
        <input type="hidden" name="sort" value={active.sort} />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="f-q" className="eyebrow">
          Search
        </Label>
        <Input
          id="f-q"
          name="q"
          type="search"
          defaultValue={active.q ?? ""}
          placeholder="Street, landmark, wording"
          className="bg-surface"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="f-area" className="eyebrow">
          Area
        </Label>
        <FilterSelect
          id="f-area"
          name="area"
          anyLabel="Anywhere in Puttalam"
          options={AREAS.map((a) => ({ value: a, label: a }))}
          defaultValue={active.area}
        />
      </div>

      <div className="space-y-2">
        <span className="eyebrow block">Monthly rent</span>
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="f-min" className="sr-only">
            Lowest rent
          </Label>
          <Input
            id="f-min"
            name="min"
            type="number"
            min={0}
            step={500}
            inputMode="numeric"
            defaultValue={active.min ?? ""}
            placeholder="From"
            className="bg-surface font-mono text-[0.8125rem]"
          />
          <Label htmlFor="f-max" className="sr-only">
            Highest rent
          </Label>
          <FilterSelect
            id="f-max"
            name="max"
            anyLabel="Any rent"
            options={BUDGETS.map((b) => ({
              value: String(b),
              label: `Up to ${b.toLocaleString("en-LK")}`,
            }))}
            defaultValue={active.max}
            className="font-mono text-[0.8125rem]"
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="eyebrow mb-2">Boarding for</legend>
        <RadioGroup name="gender" defaultValue={active.gender || ANY} className="gap-1.5">
          {[{ value: ANY, label: "Anyone" }, ...GENDERS].map((g) => (
            <div key={g.value} className="flex items-center gap-2.5">
              <RadioGroupItem id={`f-gender-${g.value}`} value={g.value} />
              <Label
                htmlFor={`f-gender-${g.value}`}
                className="cursor-pointer font-normal text-ink-soft"
              >
                {g.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <Separator />

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          <SubmitSpinner />
          Apply filters
        </Button>
        {isFiltered ? (
          <Link
            href="/boardings"
            className="text-[0.8125rem] text-ink-soft underline underline-offset-4 transition-colors hover:text-laterite"
          >
            Clear all
          </Link>
        ) : null}
      </div>
    </SearchForm>
  );
}
