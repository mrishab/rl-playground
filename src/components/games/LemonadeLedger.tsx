import { DollarSign } from "lucide-react";
import type { LemonadeState } from "@/lib/games/types";
import { LemonadeFinancialSummary } from "./LemonadeFinancialSummary";

type Props = {
  state: LemonadeState;
};

const WEATHER_ICONS: Record<string, string> = {
  Sunny: "☀️",
  Cloudy: "⛅",
  Rainy: "🌧️",
  Heatwave: "🔥",
};

export function LemonadeLedger({ state }: Props) {
  const isProfitable = state.dailyProfit >= 0;

  return (
    <div className="bg-neutral-900 border border-border/70 rounded-xl p-3 space-y-2 text-xs font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-sans font-semibold text-sm">
          <span>{WEATHER_ICONS[state.weather]}</span>
          <span>
            Day {state.day}: {state.weather}
          </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-semibold text-sm">
          <DollarSign className="h-3.5 w-3.5" /> ${state.cashBalance.toFixed(1)}
        </div>
      </div>
      <LemonadeFinancialSummary
        prepped={state.cupsPrepped}
        demand={state.customerDemand}
        sold={state.cupsSold}
        spoiled={state.cupsSpoiled}
      />
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/30">
        <span className="text-muted-foreground">
          Lost Customers:{" "}
          <span className="text-amber-400">{state.customersLost}</span>
        </span>
        <span
          className={
            isProfitable
              ? "text-emerald-400 font-semibold"
              : "text-red-400 font-semibold"
          }
        >
          Profit:{" "}
          {state.dailyProfit >= 0
            ? `+$${state.dailyProfit}`
            : `-$${Math.abs(state.dailyProfit)}`}
        </span>
      </div>
    </div>
  );
}
