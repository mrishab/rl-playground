import type { ChessPiece } from "@/lib/games/types";
import { CHESS_SYMBOLS, type ChessSymbolKey } from "./chessSymbols";

interface Props {
  r: number;
  c: number;
  cell: ChessPiece | null;
  isLastFrom: boolean;
  isLastTo: boolean;
}

export function ChessBoardCell({ r, c, cell, isLastFrom, isLastTo }: Props) {
  const isLight = (r + c) % 2 === 0;
  const symbolKey = cell
    ? (`${cell.color}-${cell.type}` as ChessSymbolKey)
    : null;
  const symbol = symbolKey ? CHESS_SYMBOLS[symbolKey] : null;

  return (
    <div
      className={`relative flex items-center justify-center rounded transition-[color,background-color,border-color] duration-150 ease-out text-2xl sm:text-3xl font-serif select-none ${
        isLight ? "bg-muted/40" : "bg-muted/20"
      } ${isLastTo ? "ring-2 ring-primary" : ""} ${isLastFrom ? "bg-primary/10" : ""}`}
    >
      {cell && (
        <span
          className={
            cell.color === "w"
              ? "text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              : "text-destructive drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          }
        >
          {symbol}
        </span>
      )}
    </div>
  );
}
