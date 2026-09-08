import { AREAS, GENDERS } from "@/lib/types";
import { Button } from "./ui";

const BUDGETS = [4000, 5000, 6000, 7000, 8000];

/**
 * A plain GET form, so a search becomes a shareable URL like
 * /boardings?area=Kalladi&max=6000 and the results render on the server.
 */
export function HeroSearch() {
  return (
    <form
      action="/boardings"
      method="get"
      className="rise rounded-card border border-crust bg-surface p-2 shadow-[0_24px_60px_-40px_rgba(13,31,27,0.5)]"
      style={{ animationDelay: "160ms" }}
    >
      <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
        <label className="flex flex-col gap-1.5 p-2">
          <span className="eyebrow">Area</span>
          <select name="area" className="field" defaultValue="">
            <option value="">Anywhere in Puttalam</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 p-2">
          <span className="eyebrow">Budget</span>
          <select name="max" className="field" defaultValue="">
            <option value="">Any rent</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                Up to Rs {b.toLocaleString("en-LK")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 p-2">
          <span className="eyebrow">Boarding for</span>
          <select name="gender" className="field" defaultValue="">
            <option value="">Anyone</option>
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end p-2">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Search rooms
          </Button>
        </div>
      </div>
    </form>
  );
}
