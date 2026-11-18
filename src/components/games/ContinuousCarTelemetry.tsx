import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarSensorReadouts } from "./ContinuousCarSensorReadouts";

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
        <span
          className={
            state.isCollided ? "text-red-400 font-bold" : "text-amber-300"
          }
        >
          {state.isCollided ? "CRASH! Barrier Hit" : `Steering: ${steerText}`}
        </span>
        <div
          className="flex items-center gap-0.5"
          title="Neural Network Hidden Neurons"
        >
          {state.neuralNetwork.hiddenActivations.slice(0, 6).map((act, i) => (
            <div
              key={i}
              className="w-1.5 h-3 rounded-xs"
              style={{
                backgroundColor:
                  act > 0
                    ? `rgba(56, 189, 248, ${Math.min(1, Math.abs(act))})`
                    : `rgba(239, 68, 68, ${Math.min(1, Math.abs(act))})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
