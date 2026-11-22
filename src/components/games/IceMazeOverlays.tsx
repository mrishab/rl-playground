import type { IceMazeState } from "@/lib/games/types";

interface Props {
  state: IceMazeState;
  cellSize: number;
  isWall: (r: number, c: number) => boolean;
  isHazard: (r: number, c: number) => boolean;
}

export function IceMazeOverlays({ state, cellSize, isWall, isHazard }: Props) {
  return (
    <>
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
    </>
  );
}
