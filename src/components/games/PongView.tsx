import type { PongState } from "@/lib/games/types";
import { PongScoreboard } from "./PongScoreboard";

type Props = {
  state: PongState;
};

export function PongView({ state }: Props) {
  return (
    <div className="relative w-full aspect-[3/2] max-w-xl mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 shadow-inner flex items-center justify-center">
      <svg viewBox="0 0 240 160" className="w-full h-full select-none">
        <line
          x1="120"
          y1="0"
          x2="120"
          y2="160"
          stroke="#334155"
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
          fill="#94a3b8"
        />
        <rect
          x="228"
          y={state.agentY}
          width="6"
          height="34"
          rx="3"
          fill="#38bdf8"
        />
        <circle cx={state.ballX} cy={state.ballY} r="3.5" fill="#facc15" />
      </svg>
      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-muted-foreground/80">
        <span>Opponent (Left AI)</span>
        <span className="text-sky-400">RL Agent (Right Paddle)</span>
      </div>
    </div>
  );
}
