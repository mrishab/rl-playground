import type { ChessState } from "@/lib/games/types";

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
  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 p-2 shadow-inner">
      <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-1">
        {state.board.map((row, r) =>
          row.map((cell, c) => {
            const isLight = (r + c) % 2 === 0;
            const isLastFrom =
              state.lastMove?.from[0] === r && state.lastMove?.from[1] === c;
            const isLastTo =
              state.lastMove?.to[0] === r && state.lastMove?.to[1] === c;
            const symbol = cell ? SYMBOLS[`${cell.color}-${cell.type}`] : null;

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
    </div>
  );
}
