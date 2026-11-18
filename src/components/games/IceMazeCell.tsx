interface Props {
  r: number;
  c: number;
  cellSize: number;
  wall: boolean;
  hazard: boolean;
  isGoal: boolean;
}

export function IceMazeCell({ r, c, cellSize, wall, hazard, isGoal }: Props) {
  const fill = wall
    ? "hsl(var(--muted))"
    : hazard
      ? "hsl(var(--destructive) / 0.3)"
      : isGoal
        ? "hsl(var(--success) / 0.3)"
        : "hsl(var(--background))";

  return (
    <g>
      <rect
        x={c * cellSize + 0.4}
        y={r * cellSize + 0.4}
        width={cellSize - 0.8}
        height={cellSize - 0.8}
        fill={fill}
        rx={1.5}
        stroke="hsl(var(--primary))"
        strokeWidth={wall ? "0" : "0.2"}
        strokeOpacity="0.25"
      />
      {hazard && (
        <text
          x={(c + 0.5) * cellSize}
          y={(r + 0.65) * cellSize}
          textAnchor="middle"
          fontSize="4.5"
          fill="hsl(var(--destructive))"
        >
          ☠
        </text>
      )}
      {isGoal && (
        <text
          x={(c + 0.5) * cellSize}
          y={(r + 0.65) * cellSize}
          textAnchor="middle"
          fontSize="4.5"
          fill="hsl(var(--success))"
        >
          ★
        </text>
      )}
    </g>
  );
}
