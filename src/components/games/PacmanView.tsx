import type { PacmanState } from "@/lib/games/types";
import { DEFAULT_MAZE, PACMAN_GRID_SIZE } from "@/lib/games/pacmanEngine";
import { PacmanPellets } from "./PacmanPellets";

type Props = {
  state: PacmanState;
};

export function PacmanView({ state }: Props) {
  const cellSize = 100 / PACMAN_GRID_SIZE;
  const status = state.isOver
    ? state.won
      ? "Maze Cleared!"
      : "Caught by Ghost"
    : state.frightenedTimer > 0
      ? `Power Active (${state.frightenedTimer})`
      : `Pellets: ${state.pelletsRemaining}`;

  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 p-2 shadow-inner flex flex-col justify-between">
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
              fill={cell === 1 ? "#1e293b" : "transparent"}
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
          fill="#eab308"
        />
        {state.ghosts.map((g) => (
          <circle
            key={g.id}
            cx={(g.col + 0.5) * cellSize}
            cy={(g.row + 0.5) * cellSize}
            r="3.5"
            fill={g.isFrightened ? "#3b82f6" : g.color}
          />
        ))}
      </svg>

      {/* Sleek bottom status bar */}
      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/90 pt-1 border-t border-border/40 px-1">
        <span className="text-amber-400">Score: {state.score}</span>
        <span
          className={`text-[9px] text-center truncate max-w-[140px] ${
            state.frightenedTimer > 0
              ? "text-sky-400 font-semibold animate-pulse"
              : "text-muted-foreground"
          }`}
        >
          {status}
        </span>
        <span className="text-cyan-400">Eaten: {state.ghostsEaten}</span>
      </div>
    </div>
  );
}
