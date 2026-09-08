import { SearchIcon } from "lucide-react";
import { FilterSelect } from "@/components/filter-select";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AREAS, GENDERS } from "@/lib/types";

const BUDGETS = [4000, 5000, 6000, 7000, 8000];

export function HeroSearch() {
  return (
    <SearchForm className="rise rounded-card border border-crust bg-surface p-2 shadow-[0_24px_60px_-40px_rgba(13,31,27,0.5)]">
      <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div className="flex flex-col gap-1.5 p-2">
          <Label htmlFor="hero-area" className="eyebrow">
            Area
          </Label>
          <FilterSelect
            id="hero-area"
            name="area"
            anyLabel="Anywhere in Puttalam"
            options={AREAS.map((a) => ({ value: a, label: a }))}
          />
        </div>

        <div className="flex flex-col gap-1.5 p-2">
          <Label htmlFor="hero-max" className="eyebrow">
            Budget
          </Label>
          <FilterSelect
            id="hero-max"
            name="max"
            anyLabel="Any rent"
            options={BUDGETS.map((b) => ({
              value: String(b),
              label: `Up to Rs ${b.toLocaleString("en-LK")}`,
            }))}
          />
        </div>

        <div className="flex flex-col gap-1.5 p-2">
          <Label htmlFor="hero-gender" className="eyebrow">
            Boarding for
          </Label>
          <FilterSelect
            id="hero-gender"
            name="gender"
            anyLabel="Anyone"
            options={GENDERS.map((g) => ({ value: g.value, label: g.label }))}
          />
        </div>

        <div className="flex items-end p-2">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            <SearchIcon />
            Search rooms
          </Button>
        </div>
      </div>
    </SearchForm>
  );
}
