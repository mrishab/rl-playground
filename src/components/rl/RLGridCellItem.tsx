import { RLCell } from "./RLCell";
import { stateKey } from "@/lib/rl/rlEngine";
import type { getGridLookups } from "./rlCellUtils";
import type { useRLStore } from "@/stores/rlStore";
import type { EditTool } from "./rlTools";

interface Props {
  r: number;
  c: number;
  store: ReturnType<typeof useRLStore.getState>;
  lookups: ReturnType<typeof getGridLookups>;
  tool: EditTool;
}

export function RLGridCellItem({ r, c, store, lookups, tool }: Props) {
  const key = stateKey(r, c);
  const q = store.qTable[key] || [0, 0, 0, 0];
  const maxQ = Math.max(...q);
  const isInspected =
    store.inspectedCell !== null &&
    store.inspectedCell[0] === r &&
    store.inspectedCell[1] === c;

  return (
    <RLCell
      r={r}
      c={c}
      isStart={store.startPos[0] === r && store.startPos[1] === c}
      isAgent={store.agentPos[0] === r && store.agentPos[1] === c}
      isGoal={store.goalPos[0] === r && store.goalPos[1] === c}
      isHazard={lookups.hazardSet.has(key)}
      isObstacle={lookups.obstacleSet.has(key)}
      isMud={lookups.mudSet.has(key)}
      isIce={lookups.iceSet.has(key)}
      isBFSPath={lookups.bfsSet?.has(key)}
      isInspected={isInspected}
      smartObstacle={lookups.smartObsMap.get(key)}
      bestAction={q.indexOf(maxQ)}
      maxQ={maxQ}
      qValues={q}
      visits={store.stateVisits[key] || 0}
      showHeatmap={store.showValueHeatmap}
      showArrows={store.showPolicyArrows}
      showQRose={store.showQRose}
      showVisits={store.showVisitHeatmap}
      onClick={() => {
        if (tool === "inspect") {
          store.setInspectedCell(isInspected ? null : [r, c]);
        } else {
          store.toggleCell(r, c, tool);
        }
      }}
    />
  );
}
