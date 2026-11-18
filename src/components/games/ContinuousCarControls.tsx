import { Zap, AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { ContinuousCarState } from "@/lib/games/types";

type Props = {
  state: ContinuousCarState;
  onErrorRateChange: (rate: number) => void;
  onBoost: () => void;
};

export function ContinuousCarControls({
  state,
  onErrorRateChange,
  onBoost,
}: Props) {
  const bumpNotice = state.lastBump ? state.lastBump.description : null;

  return (
    <div className="space-y-2 pt-1 border-t border-border/40 font-mono text-xs">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span>Villain Error Rate:</span>
        </span>
        <span className="font-semibold text-amber-400 text-[11px]">
          {Math.round(state.villainErrorRate * 100)}%
        </span>
      </div>
      <Slider
        min={0}
        max={50}
        step={5}
        value={[Math.round(state.villainErrorRate * 100)]}
        onValueChange={([val]) => onErrorRateChange(val / 100)}
        className="w-full"
      />
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <Button
          size="sm"
          variant="outline"
          onClick={onBoost}
          disabled={state.boostMeter < 12 || state.isCollided}
          className="h-6 px-2 text-[10px] gap-1 font-semibold text-orange-400 border-orange-500/40 hover:bg-orange-950/30"
        >
          <Zap className="h-3 w-3 fill-orange-400 text-orange-400" />
          <span>Boost!</span>
        </Button>
        <div className="text-[10px] truncate max-w-[220px] text-muted-foreground">
          {bumpNotice || (state.isOver ? "Race Over" : "Racing Active")}
        </div>
      </div>
    </div>
  );
}
