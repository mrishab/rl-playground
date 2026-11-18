import { Coins } from "lucide-react";
import type { SlotMachineState } from "@/lib/games/types";

interface Props {
  state: SlotMachineState;
}

export function SlotMachineReels({ state }: Props) {
  const won = state.lastPayout > 0;

  return (
    <div className="bg-card border border-border/70 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-3">
        {state.reels.map((symbol, i) => (
          <div
            key={i}
            className={`w-14 h-16 rounded-lg flex items-center justify-center text-3xl font-bold bg-background border-2 shadow-inner transition-[transform,border-color,background-color] duration-150 ease-out ${
              won
                ? "border-warning scale-105 bg-warning/10"
                : "border-border/60"
            }`}
          >
            {symbol}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between w-full text-xs font-mono pt-1 border-t border-border/30">
        <span className="flex items-center gap-1 text-warning font-semibold">
          <Coins className="h-3.5 w-3.5" /> ${state.bankroll.toFixed(1)}
        </span>
        <span
          className={`font-semibold ${
            won ? "text-success animate-pulse" : "text-muted-foreground"
          }`}
        >
          {won ? `+$${state.lastPayout} Win!` : "Bet: $1.00"}
        </span>
        <span className="text-muted-foreground">Pulls: {state.totalPulls}</span>
      </div>
    </div>
  );
}
