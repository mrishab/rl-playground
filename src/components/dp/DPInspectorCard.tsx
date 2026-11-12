import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTION_ARROWS, ACTION_NAMES, type Action } from "@/lib/rl/types";
import type { DPStateInspection } from "@/lib/rl/dpEngine";

type Props = {
  inspected: DPStateInspection;
};

export function DPInspectorCard({ inspected }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Mathematical Inspector: State ({inspected.state[0]},{" "}
          {inspected.state[1]})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted/30 border rounded p-2 text-xs font-mono">
          {inspected.formula}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {([0, 1, 2, 3] as Action[]).map((act) => {
            const actionData = inspected.actionValues[act];
            const isBest = act === inspected.bestAction;

            return (
              <div
                key={act}
                className={`p-2.5 rounded-lg border space-y-1.5 ${
                  isBest
                    ? "bg-primary/5 border-primary font-medium"
                    : "bg-muted/20"
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
                      P={t.prob.toFixed(2)} → ({t.nextState[0]},{" "}
                      {t.nextState[1]}), R={t.reward}, V={t.nextV.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
