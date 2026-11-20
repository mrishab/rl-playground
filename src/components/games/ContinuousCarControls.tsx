import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarLapSlider } from "./ContinuousCarLapSlider";
import { ContinuousCarErrorSlider } from "./ContinuousCarErrorSlider";
import { getContinuousCarNotice } from "./continuousCarTelemetryHelpers";

interface Props {
  state: ContinuousCarState;
  onErrorRateChange: (rate: number) => void;
  onTargetLapsChange: (laps: number) => void;
  onBoost: () => void;
}

export function ContinuousCarControls({
  state,
  onErrorRateChange,
  onTargetLapsChange,
  onBoost,
}: Props) {
  const notice = getContinuousCarNotice(state);

  return (
    <div className="space-y-2 pt-1 border-t border-border/40 font-mono text-xs">
      <ContinuousCarLapSlider
        targetLaps={state.targetLaps}
        onChange={onTargetLapsChange}
      />
      <ContinuousCarErrorSlider
        errorRate={state.villainErrorRate}
        onChange={onErrorRateChange}
      />
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <Button
          size="sm"
          variant="outline"
          onClick={onBoost}
          disabled={state.boostMeter < 12 || state.isCollided}
          className="h-6 px-2 text-[10px] gap-1 font-semibold text-warning border-warning/40 hover:bg-warning/10"
        >
          <Zap className="h-3 w-3 fill-warning text-warning" />
          <span>Boost!</span>
        </Button>
        <div className="text-[10px] text-muted-foreground leading-tight min-w-0 text-right flex-1">
          {notice}
        </div>
      </div>
    </div>
  );
}
