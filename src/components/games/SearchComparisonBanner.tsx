import { AlertTriangle, Compass, Sparkles } from "lucide-react";
import type { ControllerMode, GameId } from "@/lib/games/types";
import { SEARCH_COMPARISONS } from "./searchComparisons";

interface Props {
  gameId: GameId;
  controller: ControllerMode;
  failureNotice?: string | null;
}

export function SearchComparisonBanner({
  gameId,
  controller,
  failureNotice,
}: Props) {
  const comp = SEARCH_COMPARISONS[gameId];
  if (!comp) return null;

  return (
    <div
      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-[color,background-color,border-color] duration-150 ease-out ${
        controller === "search"
          ? "bg-warning/10 border-warning/30 text-foreground"
          : "bg-primary/10 border-primary/20 text-foreground"
      }`}
    >
      {controller === "search" ? (
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
      ) : (
        <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
      )}
      <div className="space-y-0.5 flex-1">
        <div className="font-semibold flex items-center gap-1.5">
          <Compass className="h-3 w-3" />
          <span>
            {controller === "search"
              ? "Deterministic Search Active"
              : "RL Policy Active"}
          </span>
          {failureNotice && (
            <span className="ml-auto text-[10px] bg-destructive/20 text-destructive font-mono px-1.5 py-0.5 rounded">
              {failureNotice}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {controller === "search" ? comp.search : comp.rl}
        </p>
      </div>
    </div>
  );
}
