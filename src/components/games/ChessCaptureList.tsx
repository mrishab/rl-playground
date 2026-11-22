import type { ChessPieceColor, ChessPieceType } from "@/lib/games/types";
import { ChessPieceIcon } from "./ChessPieceIcon";

interface Props {
  label: string;
  pieceColor: ChessPieceColor;
  captures: ChessPieceType[];
  captureColor: ChessPieceColor;
  textColor: string;
}

export function ChessCaptureList({
  label,
  pieceColor,
  captures,
  captureColor,
  textColor,
}: Props) {
  return (
    <div className={`flex items-center gap-1 ${textColor}`}>
      <span className="font-semibold">{label}</span>
      <ChessPieceIcon type="K" color={pieceColor} className="w-3.5 h-3.5" />
      {captures.length > 0 && (
        <span className="flex items-center gap-0.5 ml-1">
          +
          {captures.map((t, i) => (
            <ChessPieceIcon
              key={i}
              type={t}
              color={captureColor}
              className="w-3 h-3"
            />
          ))}
        </span>
      )}
    </div>
  );
}
