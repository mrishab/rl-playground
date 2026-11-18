type Props = {
  r: number;
  c: number;
  cellSize: number;
  wall: boolean;
  hazard: boolean;
  isGoal: boolean;
};

export function IceMazeCell({ r, c, cellSize, wall, hazard, isGoal }: Props) {
  const fill = wall
    ? "#1e293b"
    : hazard
      ? "#7f1d1d"
      : isGoal
        ? "#065f46"
        : "#0f172a";

  return (
    <g>
      <rect
        x={c * cellSize + 0.4}
        y={r * cellSize + 0.4}
        width={cellSize - 0.8}
        height={cellSize - 0.8}
        fill={fill}
        rx={1.5}
        stroke="#38bdf8"
        strokeWidth={wall ? "0" : "0.2"}
        strokeOpacity="0.25"
      />
      {hazard && (
        <text
          x={(c + 0.5) * cellSize}
          y={(r + 0.65) * cellSize}
          textAnchor="middle"
          fontSize="4.5"
          fill="#fca5a5"
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
          fill="#34d399"
        >
          ★
        </text>
      )}
    </g>
  );
}
