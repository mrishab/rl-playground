import type { StrategyState } from "@/lib/games/types";

interface Props {
  agent: StrategyState["agent"];
  opponent: StrategyState["opponent"];
  cellSize: number;
}

export function StrategyUnitsSvg({ agent, opponent, cellSize }: Props) {
  const ax = (agent.col + 0.5) * cellSize;
  const ay = (agent.row + 0.5) * cellSize;
  const ox = (opponent.col + 0.5) * cellSize;
  const oy = (opponent.row + 0.5) * cellSize;

  return (
    <>
      <g>
        <circle
          cx={ax}
          cy={ay}
          r="4.8"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--ring))"
          strokeWidth="1"
        />
        <rect
          x={ax - 4.5}
          y={ay - 6.5}
          width={9 * (agent.health / 100)}
          height="1.2"
          fill="hsl(var(--primary))"
          rx="0.5"
        />
      </g>
      <g>
        <circle
          cx={ox}
          cy={oy}
          r="4.8"
          fill="hsl(var(--destructive))"
          stroke="hsl(var(--danger))"
          strokeWidth="1"
        />
        <rect
          x={ox - 4.5}
          y={oy - 6.5}
          width={9 * (opponent.health / 100)}
          height="1.2"
          fill="hsl(var(--destructive))"
          rx="0.5"
        />
      </g>
    </>
  );
}
