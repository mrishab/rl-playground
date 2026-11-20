import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarSensorReadouts } from "./ContinuousCarSensorReadouts";
import { ContinuousCarGripBoostBar } from "./ContinuousCarGripBoostBar";
import { getContinuousCarStatus } from "./continuousCarTelemetryHelpers";

interface Props {
  state: ContinuousCarState;
}

export function ContinuousCarTelemetry({ state }: Props) {
  const { posBadge, statusText, statusClass } = getContinuousCarStatus(state);

  return (
    <div className="space-y-1.5 pt-1 border-t border-border/40 text-xs font-mono">
      <ContinuousCarSensorReadouts
        left={state.sensorLeft}
        forward={state.sensorForward}
        right={state.sensorRight}
      />
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-success font-semibold">
          Laps: {state.lapCount} / {state.targetLaps}
        </span>
        <span className="text-primary font-bold">{posBadge}</span>
        <span className="text-muted-foreground">
          {state.speed.toFixed(1)} px/s
        </span>
        <span className={statusClass}>{statusText}</span>
      </div>
      <ContinuousCarGripBoostBar
        boostMeter={state.boostMeter}
        lossOfControl={state.lossOfControl}
      />
    </div>
  );
}
