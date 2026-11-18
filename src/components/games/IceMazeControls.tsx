import { Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { IceMazeState } from "@/lib/games/types";

interface Props {
  state: IceMazeState;
  onSlipChange: (val: number) => void;
}

export function IceMazeControls({ state, onSlipChange }: Props) {
  const status = state.isOver
    ? state.won
      ? "Goal Reached! (+100)"
      : state.failedBySlip
        ? "Crashed into Pit! (-100)"
        : "Episode Ended (-100)"
    : state.lastSlip
      ? `Slipped! ${state.lastSlip.intended} -> ${state.lastSlip.actual}`
      : `Step ${state.stepCount} (Reward: ${state.lastReward})`;

  const statusColor =
    state.lastSlip || state.failedBySlip
      ? "text-warning font-semibold"
      : state.won
        ? "text-success font-semibold"
        : "text-muted-foreground";

  return (
    <div className="space-y-2 pt-1 border-t border-border/40">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Wind className="h-3.5 w-3.5 text-primary" />
          <span>Ice Wind / Slip Rate:</span>
        </span>
        <span className="font-semibold text-primary">
          {Math.round(state.slipRate * 100)}%
        </span>
      </div>
      <Slider
        min={0}
        max={60}
        step={5}
        value={[Math.round(state.slipRate * 100)]}
        onValueChange={([val]) => onSlipChange((val ?? 0) / 100)}
        className="w-full"
      />
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className={`truncate max-w-[220px] ${statusColor}`}>
          {status}
        </span>
        <span className="text-muted-foreground/80">
          Pos: [{state.agentRow}, {state.agentCol}]
        </span>
      </div>
    </div>
  );
}
