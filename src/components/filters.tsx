import Link from "next/link";
import { AREAS, GENDERS } from "@/lib/types";
import { Button } from "./ui";

export type ActiveFilters = {
  area?: string;
  max?: string;
  min?: string;
  gender?: string;
  q?: string;
  sort?: string;
};

const BUDGETS = [4000, 5000, 6000, 7000, 8000, 9000];

/** Filters post back as a GET form so every result set has its own URL. */
export function Filters({ active }: { active: ActiveFilters }) {
  const isFiltered = Boolean(
    active.area || active.max || active.min || active.gender || active.q,
  );

  return (
    <form action="/boardings" method="get" className="space-y-6">
      {active.sort ? <input type="hidden" name="sort" value={active.sort} /> : null}

      <div>
        <label className="eyebrow mb-2 block" htmlFor="f-q">
          Search
        </label>
        <input
          id="f-q"
          name="q"
          type="search"
          defaultValue={active.q ?? ""}
          placeholder="Street, landmark, wording"
          className="field"
        />
      </div>

      <div>
        <label className="eyebrow mb-2 block" htmlFor="f-area">
          Area
        </label>
        <select id="f-area" name="area" className="field" defaultValue={active.area ?? ""}>
          <option value="">Anywhere in Puttalam</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="eyebrow mb-2 block">Monthly rent</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="sr-only" htmlFor="f-min">
            Lowest rent
          </label>
          <input
            id="f-min"
            name="min"
            type="number"
            min={0}
            step={500}
            inputMode="numeric"
            defaultValue={active.min ?? ""}
            placeholder="From"
            className="field font-mono text-[0.8125rem]"
          />
          <label className="sr-only" htmlFor="f-max">
            Highest rent
          </label>
          <select
            id="f-max"
            name="max"
            className="field font-mono text-[0.8125rem]"
            defaultValue={active.max ?? ""}
          >
            <option value="">Any rent</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                &le; {b.toLocaleString("en-LK")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="eyebrow mb-2">Boarding for</legend>
        <div className="space-y-1.5">
          {[{ value: "", label: "Anyone" }, ...GENDERS].map((g) => (
            <label
              key={g.value || "any"}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft"
            >
              <input
                type="radio"
                name="gender"
                value={g.value}
                defaultChecked={(active.gender ?? "") === g.value}
                className="h-4 w-4 accent-lagoon"
              />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-crust pt-5">
        <Button type="submit" size="sm">
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
    </form>
  );
}
