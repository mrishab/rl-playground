import type { IceMazeState } from "@/lib/games/types";
import { ICE_MAZE_SIZE } from "@/lib/games/iceMazeEngine";
import { IceMazeCell } from "./IceMazeCell";

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
      {state.controller === "rl" &&
        state.policyArrows &&
        Object.entries(state.policyArrows).map(([key, action]) => {
          const [rStr, cStr] = key.split("_");
          const r = parseInt(rStr, 10);
          const c = parseInt(cStr, 10);
          if (
            isWall(r, c) ||
            isHazard(r, c) ||
            (r === state.goalRow && c === state.goalCol)
          ) {
            return null;
          }
          const cx = (c + 0.5) * cellSize;
          const cy = (r + 0.5) * cellSize;
          const angle = action * 90;
          return (
            <path
              key={`arrow-${key}`}
              d="M 0 -2.4 L 1.8 1.4 L 0.7 1.0 L 0.7 2.4 L -0.7 2.4 L -0.7 1.0 L -1.8 1.4 Z"
              transform={`translate(${cx}, ${cy}) rotate(${angle})`}
              fill="hsl(var(--primary))"
              opacity="0.75"
            />
          );
        })}
      {state.controller === "search" &&
        state.aStarPath.map(([pr, pc], idx) => (
          <circle
            key={`astar-${idx}`}
            cx={(pc + 0.5) * cellSize}
            cy={(pr + 0.5) * cellSize}
            r="1.2"
            fill="hsl(var(--warning))"
            opacity="0.65"
          />
        ))}
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
