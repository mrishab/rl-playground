import { DollarSign } from "lucide-react";
import type { LemonadeState, WeatherType } from "@/lib/games/types";
import { LemonadeFinancialSummary } from "./LemonadeFinancialSummary";

interface Props {
  state: LemonadeState;
}

const WEATHER_ICONS: Record<WeatherType, string> = {
  Sunny: "☀️",
  Cloudy: "⛅",
  Rainy: "🌧️",
  Heatwave: "🔥",
};

export function LemonadeLedger({ state }: Props) {
  const isProfitable = state.dailyProfit >= 0;

  return (
    <div className="bg-card border border-border/70 rounded-xl p-3 space-y-2 text-xs font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-sans font-semibold text-sm">
          <span>{WEATHER_ICONS[state.weather]}</span>
          <span>
            Day {state.day}: {state.weather}
          </span>
        </div>
        <div className="flex items-center gap-1 text-success font-semibold text-sm">
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
          <span className="text-warning">{state.customersLost}</span>
        </span>
        <span
          className={
            isProfitable
              ? "text-success font-semibold"
              : "text-destructive font-semibold"
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
