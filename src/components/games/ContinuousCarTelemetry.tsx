import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarSensorReadouts } from "./ContinuousCarSensorReadouts";
import { ContinuousCarGripBoostBar } from "./ContinuousCarGripBoostBar";

type Props = {
  state: ContinuousCarState;
};

export function ContinuousCarTelemetry({ state }: Props) {
  const steerDeg = Math.round((state.steering * 180) / Math.PI);
  const steerText =
    steerDeg > 0
      ? `+${steerDeg}° R`
      : steerDeg < 0
        ? `${steerDeg}° L`
        : "0° Center";
  const posBadge =
    state.racePosition === 1
      ? "🥇 1st"
      : state.racePosition === 2
        ? "🥈 2nd"
        : "🥉 3rd";
  const statusText = state.isCollided
    ? "CRASH!"
    : state.isSkidding
      ? "SKIDDING!"
      : steerText;
  const statusClass = state.isCollided
    ? "text-red-400 font-bold"
    : state.isSkidding
      ? "text-amber-400 font-bold animate-pulse"
      : "text-amber-300";

  return (
    <div className="space-y-1.5 pt-1 border-t border-border/40 text-xs font-mono">
      <ContinuousCarSensorReadouts
        left={state.sensorLeft}
        forward={state.sensorForward}
        right={state.sensorRight}
      />
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-emerald-400 font-semibold">
          Laps: {state.lapCount}
        </span>
        <span className="text-sky-300 font-bold">{posBadge}</span>
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
