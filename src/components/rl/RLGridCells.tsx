import { RLCell } from "./RLCell";
import { stateKey } from "@/lib/rl/rlEngine";
import { getGridLookups } from "./rlCellUtils";
import type { useRLStore } from "@/stores/rlStore";
import type { EditTool } from "./RLToolBar";

type Props = {
  store: ReturnType<typeof useRLStore.getState>;
  tool: EditTool;
};

export function RLGridCells({ store, tool }: Props) {
  const {
    gridSize,
    startPos,
    agentPos,
    goalPos,
    qTable,
    stateVisits,
    inspectedCell,
    showValueHeatmap,
    showPolicyArrows,
    showQRose,
    showVisitHeatmap,
    toggleCell,
    setInspectedCell,
  } = store;
  const { hazardSet, obstacleSet, mudSet, iceSet, smartObsMap, bfsSet } =
    getGridLookups(store);

  return (
    <div
      data-testid="grid-canvas-cells"
      className="grid gap-1.5 w-full max-w-md mx-auto"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
        const r = Math.floor(idx / gridSize);
        const c = idx % gridSize;
        const key = stateKey(r, c);
        const q = qTable[key] || [0, 0, 0, 0];
        const maxQ = Math.max(...q);
        const isInspected =
          inspectedCell !== null &&
          inspectedCell[0] === r &&
          inspectedCell[1] === c;

        return (
          <RLCell
            key={key}
            r={r}
            c={c}
            isStart={startPos[0] === r && startPos[1] === c}
            isAgent={agentPos[0] === r && agentPos[1] === c}
            isGoal={goalPos[0] === r && goalPos[1] === c}
            isHazard={hazardSet.has(key)}
            isObstacle={obstacleSet.has(key)}
            isMud={mudSet.has(key)}
            isIce={iceSet.has(key)}
            isBFSPath={bfsSet?.has(key)}
            isInspected={isInspected}
            smartObstacle={smartObsMap.get(key)}
            bestAction={q.indexOf(maxQ)}
            maxQ={maxQ}
            qValues={q}
            visits={stateVisits[key] || 0}
            showHeatmap={showValueHeatmap}
            showArrows={showPolicyArrows}
            showQRose={showQRose}
            showVisits={showVisitHeatmap}
            onClick={() => {
              if (tool === "inspect") {
                setInspectedCell(isInspected ? null : [r, c]);
              } else {
                toggleCell(r, c, tool);
              }
            }}
          />
        );
      })}
    </div>
  );
}
