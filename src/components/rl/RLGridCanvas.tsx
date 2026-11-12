import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RLToolBar, type EditTool } from "./RLToolBar";
import { RLGridCells } from "./RLGridCells";
import type { useRLStore } from "@/stores/rlStore";
import { stateKey } from "@/lib/rl/rlEngine";
import { ACTION_NAMES } from "@/lib/rl/types";

type Props = {
  store: ReturnType<typeof useRLStore.getState>;
};

export function RLGridCanvas({ store }: Props) {
  const [tool, setTool] = useState<EditTool>("hazard");

  const inspected = store.inspectedCell;
  const inspectedQ = inspected
    ? store.qTable[stateKey(inspected[0], inspected[1])] || [0, 0, 0, 0]
    : null;
  const maxQ = inspectedQ ? Math.max(...inspectedQ) : 0;
  const bestActionIdx = inspectedQ ? inspectedQ.indexOf(maxQ) : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-1 pb-1">
          <CardTitle className="text-base">Environment & Policy Map</CardTitle>

          {/* Layer toggles */}
          <div className="flex flex-wrap items-center gap-1">
            <Button
              size="sm"
              variant={store.showValueHeatmap ? "default" : "outline"}
              className="h-6 text-[10px] px-1.5"
              onClick={() => store.toggleLayer("heatmap")}
            >
              Heatmap
            </Button>
            <Button
              size="sm"
              variant={store.showPolicyArrows ? "default" : "outline"}
              className="h-6 text-[10px] px-1.5"
              onClick={() => store.toggleLayer("arrows")}
            >
              Arrows
            </Button>
            <Button
              size="sm"
              variant={store.showQRose ? "default" : "outline"}
              className="h-6 text-[10px] px-1.5"
              onClick={() => store.toggleLayer("qrose")}
            >
              Q-Values
            </Button>
            <Button
              size="sm"
              variant={store.showVisitHeatmap ? "default" : "outline"}
              className="h-6 text-[10px] px-1.5"
              onClick={() => store.toggleLayer("visits")}
            >
              Visits
            </Button>
            <Button
              size="sm"
              variant={store.showBFSPath ? "secondary" : "outline"}
              className="h-6 text-[10px] px-1.5"
              onClick={store.toggleShowBFSPath}
            >
              BFS Path
            </Button>
          </div>
        </div>

        <RLToolBar
          activeTool={tool}
          onSelectTool={setTool}
          onResetEnv={store.resetEnvironment}
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center p-4 space-y-3">
        <RLGridCells store={store} tool={tool} />

        {/* Inspected Cell Panel */}
        {inspected && inspectedQ && (
          <div className="w-full bg-muted/40 border rounded-lg p-2.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span>
                State ({inspected[0]}, {inspected[1]}): V*(s) ={" "}
                <span className="font-mono text-primary">
                  {maxQ.toFixed(2)}
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground">
                Best:{" "}
                <span className="font-semibold text-foreground">
                  {ACTION_NAMES[bestActionIdx as 0 | 1 | 2 | 3]}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[11px]">
              {[0, 1, 2, 3].map((a) => (
                <div
                  key={a}
                  className={`p-1 rounded text-center border ${
                    a === bestActionIdx
                      ? "bg-primary/10 border-primary font-bold text-primary"
                      : "bg-background/60"
                  }`}
                >
                  <div className="text-[9px] text-muted-foreground">
                    {ACTION_NAMES[a as 0 | 1 | 2 | 3]}
                  </div>
                  <div>{inspectedQ[a].toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live transition calculation log */}
        {store.lastTransition && (
          <div className="w-full bg-muted/20 border border-dashed rounded p-2 text-[11px] font-mono text-muted-foreground">
            <span className="font-semibold text-foreground">
              Last Bellman Update:{" "}
            </span>
            {store.lastTransition.formula}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
