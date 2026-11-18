import type { StrategyState } from "@/lib/games/types";

interface Props {
  nodes: StrategyState["nodes"];
  cellSize: number;
}

export function StrategyNodesSvg({ nodes, cellSize }: Props) {
  return (
    <>
      {nodes.map((node) => {
        const cx = (node.col + 0.5) * cellSize;
        const cy = (node.row + 0.5) * cellSize;
        const color =
          node.owner === "agent"
            ? "hsl(var(--primary))"
            : node.owner === "opponent"
              ? "hsl(var(--destructive))"
              : "hsl(var(--warning))";

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
    </>
  );
}
