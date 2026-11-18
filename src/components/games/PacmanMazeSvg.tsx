import type { PacmanState } from "@/lib/games/types";
import { DEFAULT_MAZE } from "@/lib/games/pacmanEngine";
import { PacmanPellets } from "./PacmanPellets";

interface Props {
  state: PacmanState;
  cellSize: number;
}

export function PacmanMazeSvg({ state, cellSize }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-[88%] select-none rounded overflow-hidden"
    >
      {DEFAULT_MAZE.map((row, r) =>
        row.map((cell, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill={cell === 1 ? "hsl(var(--muted))" : "transparent"}
            rx={cell === 1 ? 1.5 : 0}
          />
        )),
      )}
      <PacmanPellets
        pellets={state.pellets}
        powerPellets={state.powerPellets}
        cellSize={cellSize}
      />
      <circle
        cx={(state.pacman.col + 0.5) * cellSize}
        cy={(state.pacman.row + 0.5) * cellSize}
        r="3.6"
        fill="hsl(var(--warning))"
      />
      {state.ghosts.map((g) => (
        <circle
          key={g.id}
          cx={(g.col + 0.5) * cellSize}
          cy={(g.row + 0.5) * cellSize}
          r="3.5"
          fill={g.isFrightened ? "hsl(var(--primary))" : g.color}
        />
      ))}
    </svg>
  );
}
