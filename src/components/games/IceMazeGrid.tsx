import type { IceMazeState } from "@/lib/games/types";
import { ICE_MAZE_SIZE } from "@/lib/games/iceMazeEngine";
import { IceMazeCell } from "./IceMazeCell";
import { IceMazeOverlays } from "./IceMazeOverlays";

interface Props {
  state: IceMazeState;
}

export function IceMazeGrid({ state }: Props) {
  const cellSize = 100 / ICE_MAZE_SIZE;
  const isWall = (r: number, c: number) =>
    state.walls.some(([wr, wc]) => wr === r && wc === c);
  const isHazard = (r: number, c: number) =>
    state.hazards.some(([hr, hc]) => hr === r && hc === c);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full select-none rounded">
      {Array.from({ length: ICE_MAZE_SIZE }).map((_, r) =>
        Array.from({ length: ICE_MAZE_SIZE }).map((__, c) => (
          <IceMazeCell
            key={`${r}-${c}`}
            r={r}
            c={c}
            cellSize={cellSize}
            wall={isWall(r, c)}
            hazard={isHazard(r, c)}
            isGoal={r === state.goalRow && c === state.goalCol}
          />
        )),
      )}
      <IceMazeOverlays
        state={state}
        cellSize={cellSize}
        isWall={isWall}
        isHazard={isHazard}
      />
      <circle
        cx={(state.agentCol + 0.5) * cellSize}
        cy={(state.agentRow + 0.5) * cellSize}
        r="4.2"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="0.8"
      />
    </svg>
  );
}
