import type { PongState } from "@/lib/games/types";
import { PongScoreboard } from "./PongScoreboard";

interface Props {
  state: PongState;
}

export function PongCourtSvg({ state }: Props) {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-full select-none">
      <line
        x1="120"
        y1="0"
        x2="120"
        y2="160"
        stroke="hsl(var(--border))"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <PongScoreboard
        opponentScore={state.opponentScore}
        agentScore={state.agentScore}
        rallyLength={state.rallyLength}
        maxRally={state.maxRally}
      />
      <rect
        x="6"
        y={state.opponentY}
        width="6"
        height="34"
        rx="3"
        fill="hsl(var(--muted-foreground))"
      />
      <rect
        x="228"
        y={state.agentY}
        width="6"
        height="34"
        rx="3"
        fill="hsl(var(--primary))"
      />
      <circle
        cx={state.ballX}
        cy={state.ballY}
        r="3.5"
        fill="hsl(var(--warning))"
      />
    </svg>
  );
}
