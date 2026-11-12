import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";
import type { SmartObstacle } from "@/lib/rl/types";
import { stateKey } from "@/lib/rl/rlEngine";
import type { useRLStore } from "@/stores/rlStore";

export const ARROWS = [ArrowUp, ArrowRight, ArrowDown, ArrowLeft];

export type RLCellProps = {
  r: number;
  c: number;
  isStart?: boolean;
  isAgent: boolean;
  isGoal: boolean;
  isHazard: boolean;
  isObstacle: boolean;
  isMud?: boolean;
  isIce?: boolean;
  isBFSPath?: boolean;
  isInspected?: boolean;
  smartObstacle?: SmartObstacle;
  bestAction?: number;
  maxQ: number;
  qValues?: [number, number, number, number];
  visits?: number;
  showHeatmap: boolean;
  showArrows: boolean;
  showQRose: boolean;
  showVisits: boolean;
};

export function getBgStyle(
  isBlocked: boolean,
  q: number,
  showHeatmap: boolean,
  isInspected?: boolean,
) {
  if (isInspected) {
    return {
      outline: "2px solid hsl(var(--primary))",
      outlineOffset: "1px",
    };
  }
  if (!showHeatmap || isBlocked || q === 0) return undefined;
  const token = q > 0 ? "--success" : "--destructive";
  return {
    backgroundColor: `hsl(var(${token}) / ${Math.min(0.35, Math.abs(q) / 60)})`,
  };
}

export function getGridLookups(store: ReturnType<typeof useRLStore.getState>) {
  return {
    hazardSet: new Set(store.hazards.map(([r, c]) => stateKey(r, c))),
    obstacleSet: new Set(store.obstacles.map(([r, c]) => stateKey(r, c))),
    mudSet: new Set((store.muds || []).map(([r, c]) => stateKey(r, c))),
    iceSet: new Set((store.ices || []).map(([r, c]) => stateKey(r, c))),
    smartObsMap: new Map(
      store.smartObstacles.map((o) => [stateKey(o.r, o.c), o]),
    ),
    bfsSet: store.showBFSPath
      ? new Set(store.bfsResult.path.map(([r, c]) => stateKey(r, c)))
      : null,
  };
}
