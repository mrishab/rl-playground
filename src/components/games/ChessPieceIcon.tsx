import { ChessPieceGlyph } from "./ChessPieceGlyph";
import type { ChessPieceColor, ChessPieceType } from "@/lib/games/types";

interface Props {
  type: ChessPieceType;
  color: ChessPieceColor;
  className?: string;
}

export function ChessPieceIcon({ type, color, className = "w-7 h-7" }: Props) {
  const isWhite = color === "w";
  const fill = isWhite ? "hsl(var(--card))" : "hsl(var(--foreground))";
  const stroke = isWhite ? "hsl(var(--primary))" : "hsl(var(--background))";

  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} shrink-0 select-none drop-shadow-xs`}
    >
      <ChessPieceGlyph type={type} stroke={stroke} />
    </svg>
  );
}
