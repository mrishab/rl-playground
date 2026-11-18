import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RLToolBar, type EditTool } from "./RLToolBar";
import { RLGridCells } from "./RLGridCells";
import type { useRLStore } from "@/stores/rlStore";
import { stateKey } from "@/lib/rl/rlEngine";
import { RLGridLayerToggles } from "./RLGridLayerToggles";
import { RLInspectedCellPanel } from "./RLInspectedCellPanel";

interface Props {
  store: ReturnType<typeof useRLStore.getState>;
}

export function RLGridCanvas({ store }: Props) {
  const [tool, setTool] = useState<EditTool>("hazard");
  const inspected = store.inspectedCell;
  const inspectedQ = inspected
    ? store.qTable[stateKey(inspected[0], inspected[1])] || [0, 0, 0, 0]
    : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-1 pb-1">
          <CardTitle className="text-base">Environment & Policy Map</CardTitle>
          <RLGridLayerToggles store={store} />
        </div>
        <RLToolBar
          activeTool={tool}
          onSelectTool={setTool}
          onResetEnv={store.resetEnvironment}
        />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-4 space-y-3">
        <RLGridCells store={store} tool={tool} />
        {inspected && inspectedQ && (
          <RLInspectedCellPanel inspected={inspected} inspectedQ={inspectedQ} />
        )}
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
