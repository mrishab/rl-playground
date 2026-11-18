import type { ContinuousCarState } from "@/lib/games/types";

interface Props {
  state: ContinuousCarState;
}

export function ContinuousCarAgentVehicle({ state }: Props) {
  const agentDeg = (state.angle * 180) / Math.PI;

  return (
    <g transform={`translate(${state.x}, ${state.y}) rotate(${agentDeg})`}>
      {state.isBoosting && (
        <polygon
          points="-6,-2 -11,0 -6,2"
          fill="hsl(var(--warning))"
          opacity="0.9"
        />
      )}
      <rect
        x="-6"
        y="-3.5"
        width="12"
        height="7"
        rx="1.5"
        fill={
          state.isCollided ? "hsl(var(--destructive))" : "hsl(var(--success))"
        }
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="0.8"
      />
      <line
        x1="2"
        y1="0"
        x2="6"
        y2="0"
        stroke="hsl(var(--warning))"
        strokeWidth="1.5"
      />
      {state.isSkidding && (
        <circle
          cx="0"
          cy="0"
          r="5"
          fill="none"
          stroke="hsl(var(--warning))"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}
    </g>
  );
}
