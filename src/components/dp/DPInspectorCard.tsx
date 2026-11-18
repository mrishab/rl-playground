import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Action } from "@/lib/rl/types";
import type { DPStateInspection } from "@/lib/rl/dpEngine";
import { DPActionValueTile } from "./DPActionValueTile";

interface Props {
  inspected: DPStateInspection;
}

export function DPInspectorCard({ inspected }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Inspector: State ({inspected.state[0]}, {inspected.state[1]})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted/30 border rounded p-2 text-xs font-mono">
          {inspected.formula}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {([0, 1, 2, 3] as Action[]).map((act) => (
            <DPActionValueTile
              key={act}
              act={act}
              actionData={inspected.actionValues[act]}
              isBest={act === inspected.bestAction}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
