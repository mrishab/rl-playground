import type { ChessState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";

type Props = {
  state: ChessState;
};

const SYMBOLS: Record<string, string> = {
  "w-K": "♔",
  "w-Q": "♕",
  "w-R": "♖",
  "w-N": "♘",
  "w-P": "♙",
  "b-K": "♚",
  "b-Q": "♛",
  "b-R": "♜",
  "b-N": "♞",
  "b-P": "♟",
};

export function ChessView({ state }: Props) {
  const controller = useGamesStore((s) => s.controllerMode);
  const statusText = state.isOver
    ? state.winner === "w"
      ? "White Wins (Agent)"
      : state.winner === "b"
        ? "Black Wins (Opponent)"
        : "Draw (Turn limit)"
    : `Turn ${state.moveCount} (${state.turn === "w" ? "White" : "Black"})`;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner gameId="chess" controller={controller} />
      <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 p-2 shadow-inner flex flex-col justify-between">
        <div className="grid grid-cols-4 grid-rows-4 w-full h-[88%] gap-1">
          {state.board.map((row, r) =>
            row.map((cell, c) => {
              const isLight = (r + c) % 2 === 0;
              const isLastFrom =
                state.lastMove?.from[0] === r && state.lastMove?.from[1] === c;
              const isLastTo =
                state.lastMove?.to[0] === r && state.lastMove?.to[1] === c;
              const symbol = cell
                ? SYMBOLS[`${cell.color}-${cell.type}`]
                : null;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative flex items-center justify-center rounded transition-colors text-2xl sm:text-3xl font-serif select-none ${
                    isLight ? "bg-muted/40" : "bg-muted/20"
                  } ${isLastTo ? "ring-2 ring-primary" : ""} ${isLastFrom ? "bg-primary/10" : ""}`}
                >
                  {cell && (
                    <span
                      className={
                        cell.color === "w"
                          ? "text-sky-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                          : "text-rose-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      }
                    >
                      {symbol}
                    </span>
                  )}
                </div>
              );
            }),
          )}
        </div>

        {/* Sleek bottom status bar */}
        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/90 pt-1 border-t border-border/40 px-1">
          <span className="text-sky-400">
            Agent (White ♔){" "}
            {state.agentCaptures.length > 0 &&
              `+${state.agentCaptures.map((t) => SYMBOLS[`b-${t}`]).join("")}`}
          </span>
          <span className="text-[9px] text-muted-foreground text-center truncate max-w-[120px]">
            {statusText}
          </span>
          <span className="text-rose-400">
            Opp (Black ♚){" "}
            {state.opponentCaptures.length > 0 &&
              `+${state.opponentCaptures.map((t) => SYMBOLS[`w-${t}`]).join("")}`}
          </span>
        </div>
      </div>
    </div>
  );
}
