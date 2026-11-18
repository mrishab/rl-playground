import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarTrackGeometry } from "./ContinuousCarTrackGeometry";
import { ContinuousCarSensorRays } from "./ContinuousCarSensorRays";
import { ContinuousCarVehicles } from "./ContinuousCarVehicles";

type Props = {
  state: ContinuousCarState;
};

export function ContinuousCarTrack({ state }: Props) {
  return (
    <svg
      viewBox="0 0 320 200"
      className="w-full h-full select-none rounded bg-neutral-950"
    >
      <ContinuousCarTrackGeometry cx={160} cy={100} rIn={45} rOut={90} />
      {state.skidMarks.map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r="1.5" fill="#f59e0b" opacity="0.45" />
      ))}
      <ContinuousCarSensorRays
        x={state.x}
        y={state.y}
        angle={state.angle}
        sensorLeft={state.sensorLeft}
        sensorRight={state.sensorRight}
        sensorForward={state.sensorForward}
      />
      <ContinuousCarVehicles state={state} />
    </svg>
  );
}
