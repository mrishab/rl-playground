import { STRATEGY_GRID_SIZE } from "@/lib/games/strategyEngine";

interface Props {
  obstacles: [number, number][];
  cellSize: number;
}

export function StrategyGridSvg({ obstacles, cellSize }: Props) {
  return (
    <>
      {Array.from({ length: STRATEGY_GRID_SIZE }).map((_, r) =>
        Array.from({ length: STRATEGY_GRID_SIZE }).map((_, c) => {
          const isObstacle = obstacles.some(([or, oc]) => or === r && oc === c);
          return (
            <rect
              key={`cell-${r}-${c}`}
              x={c * cellSize + 0.5}
              y={r * cellSize + 0.5}
              width={cellSize - 1}
              height={cellSize - 1}
              rx={isObstacle ? 2 : 1}
              fill={isObstacle ? "hsl(var(--muted))" : "hsl(var(--background))"}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          );
        }),
      )}
    </>
  );
}
