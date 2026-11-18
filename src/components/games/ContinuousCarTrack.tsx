import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarTrackGeometry } from "./ContinuousCarTrackGeometry";

type Props = {
  state: ContinuousCarState;
};

export function ContinuousCarTrack({ state }: Props) {
  const cx = 160;
  const cy = 100;
  const rIn = 45;
  const rOut = 90;

  const leftAngle = state.angle - Math.PI / 4;
  const rightAngle = state.angle + Math.PI / 4;
  const lx = state.x + Math.cos(leftAngle) * state.sensorLeft;
  const ly = state.y + Math.sin(leftAngle) * state.sensorLeft;
  const rx = state.x + Math.cos(rightAngle) * state.sensorRight;
  const ry = state.y + Math.sin(rightAngle) * state.sensorRight;
  const fx = state.x + Math.cos(state.angle) * state.sensorForward;
  const fy = state.y + Math.sin(state.angle) * state.sensorForward;

  return (
    <svg
      viewBox="0 0 320 200"
      className="w-full h-full select-none rounded bg-neutral-950"
    >
      <ContinuousCarTrackGeometry cx={cx} cy={cy} rIn={rIn} rOut={rOut} />
      {/* Sensor rays */}
      <line
        x1={state.x}
        y1={state.y}
        x2={lx}
        y2={ly}
        stroke="#38bdf8"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      <line
        x1={state.x}
        y1={state.y}
        x2={rx}
        y2={ry}
        stroke="#38bdf8"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      <line
        x1={state.x}
        y1={state.y}
        x2={fx}
        y2={fy}
        stroke="#eab308"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      {/* Car body */}
      <g
        transform={`translate(${state.x}, ${state.y}) rotate(${(state.angle * 180) / Math.PI})`}
      >
        <rect
          x="-6"
          y="-3.5"
          width="12"
          height="7"
          rx="1.5"
          fill={state.isCollided ? "#ef4444" : "#22c55e"}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <line x1="2" y1="0" x2="6" y2="0" stroke="#fef08a" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
