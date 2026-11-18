import { ACTION_ARROWS, ACTION_NAMES, type Action } from "@/lib/rl/types";
import type { DPStateInspection } from "@/lib/rl/dpEngine";

interface Props {
  act: Action;
  actionData: DPStateInspection["actionValues"][Action];
  isBest: boolean;
}

export function DPActionValueTile({ act, actionData, isBest }: Props) {
  return (
    <div
      className={`p-2.5 rounded-lg border space-y-1.5 ${
        isBest ? "bg-primary/5 border-primary font-medium" : "bg-muted/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          Action: {ACTION_NAMES[act]} {ACTION_ARROWS[act]}
        </span>
        <span className="font-mono text-primary font-bold">
          {actionData.expectedValue.toFixed(3)}
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground space-y-0.5">
        {actionData.transitions.map((t, i) => (
          <div key={i} className="font-mono">
            P={t.prob.toFixed(2)} → ({t.nextState[0]}, {t.nextState[1]}), R=
            {t.reward}, V={t.nextV.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
