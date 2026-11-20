import type { ChessPiece } from "@/lib/games/types";
import { ChessPieceIcon } from "./ChessPieceIcon";

interface Props {
  r: number;
  c: number;
  cell: ChessPiece | null;
  isLastFrom: boolean;
  isLastTo: boolean;
}

export function ChessBoardCell({ r, c, cell, isLastFrom, isLastTo }: Props) {
  const isLight = (r + c) % 2 === 0;

  return (
    <div
      className={`relative flex items-center justify-center rounded transition-[color,background-color,border-color] duration-150 ease-out select-none ${
        isLight ? "bg-muted/40" : "bg-muted/20"
      } ${isLastTo ? "ring-2 ring-primary" : ""} ${isLastFrom ? "bg-primary/10" : ""}`}
    >
      {cell && (
        <ChessPieceIcon
          type={cell.type}
          color={cell.color}
          className="w-7 h-7 sm:w-9 sm:h-9"
        />
      )}
    </div>
  );
}
