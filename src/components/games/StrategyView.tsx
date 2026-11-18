import type { StrategyState } from "@/lib/games/types";
import { STRATEGY_GRID_SIZE } from "@/lib/games/strategyEngine";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";

type Props = {
  state: StrategyState;
};

export function StrategyView({ state }: Props) {
  const controller = useGamesStore((s) => s.controllerMode);
  const cellSize = 100 / STRATEGY_GRID_SIZE;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner gameId="strategy" controller={controller} />
      <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 p-2 shadow-inner">
        <svg viewBox="0 0 100 100" className="w-full h-full select-none">
          {/* Background Grid Cells */}
          {Array.from({ length: STRATEGY_GRID_SIZE }).map((_, r) =>
            Array.from({ length: STRATEGY_GRID_SIZE }).map((_, c) => {
              const isObstacle = state.obstacles.some(
                ([or, oc]) => or === r && oc === c,
              );
              return (
                <rect
                  key={`cell-${r}-${c}`}
                  x={c * cellSize + 0.5}
                  y={r * cellSize + 0.5}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  rx={isObstacle ? 2 : 1}
                  fill={isObstacle ? "#334155" : "#0f172a"}
                  stroke="#1e293b"
                  strokeWidth="0.5"
                />
              );
            }),
          )}

          {/* Tactical Nodes */}
          {state.nodes.map((node) => {
            const cx = (node.col + 0.5) * cellSize;
            const cy = (node.row + 0.5) * cellSize;
            const color =
              node.owner === "agent"
                ? "#38bdf8"
                : node.owner === "opponent"
                  ? "#f43f5e"
                  : "#f59e0b";

            return (
              <g key={node.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.8"
                  strokeDasharray="1.5 1"
                />
                <polygon
                  points={`${cx},${cy - 2.8} ${cx + 2.8},${cy} ${cx},${cy + 2.8} ${cx - 2.8},${cy}`}
                  fill={color}
                  opacity={node.owner === "neutral" ? 0.7 : 0.95}
                />
              </g>
            );
          })}

          {/* Agent Unit */}
          <g>
            <circle
              cx={(state.agent.col + 0.5) * cellSize}
              cy={(state.agent.row + 0.5) * cellSize}
              r="4.8"
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            {/* Agent HP indicator */}
            <rect
              x={(state.agent.col + 0.5) * cellSize - 4.5}
              y={(state.agent.row + 0.5) * cellSize - 6.5}
              width={9 * (state.agent.health / 100)}
              height="1.2"
              fill="#38bdf8"
              rx="0.5"
            />
          </g>

          {/* Opponent Unit */}
          <g>
            <circle
              cx={(state.opponent.col + 0.5) * cellSize}
              cy={(state.opponent.row + 0.5) * cellSize}
              r="4.8"
              fill="#e11d48"
              stroke="#fb7185"
              strokeWidth="1"
            />
            {/* Opponent HP indicator */}
            <rect
              x={(state.opponent.col + 0.5) * cellSize - 4.5}
              y={(state.opponent.row + 0.5) * cellSize - 6.5}
              width={9 * (state.opponent.health / 100)}
              height="1.2"
              fill="#fb7185"
              rx="0.5"
            />
          </g>
        </svg>

        {/* Sleek bottom status bar */}
        <div className="absolute bottom-1.5 left-2.5 right-2.5 flex justify-between items-center text-[10px] font-mono text-muted-foreground/90">
          <span className="text-sky-400">Agent HP: {state.agent.health}</span>
          <span className="truncate max-w-[140px] text-center text-[9px] text-muted-foreground">
            {state.lastActionDesc}
          </span>
          <span className="text-rose-400">Opp HP: {state.opponent.health}</span>
        </div>
      </div>
    </div>
  );
}
