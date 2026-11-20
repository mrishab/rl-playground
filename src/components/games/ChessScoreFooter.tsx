import type { ChessPieceType } from "@/lib/games/types";
import { ChessPieceIcon } from "./ChessPieceIcon";

interface Props {
  statusText: string;
  agentCaptures: ChessPieceType[];
  opponentCaptures: ChessPieceType[];
}

export function ChessScoreFooter({
  statusText,
  agentCaptures,
  opponentCaptures,
}: Props) {
  return (
    <div className="space-y-1 text-[10px] font-mono text-muted-foreground/90 pt-1.5 border-t border-border/40 px-1">
      <div
        className="text-[11px] text-foreground text-center font-semibold"
        title={statusText}
      >
        {statusText}
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <div className="flex items-center gap-1 text-primary">
          <span className="font-semibold">White (Agent)</span>
          <ChessPieceIcon type="K" color="w" className="w-3.5 h-3.5" />
          {agentCaptures.length > 0 && (
            <span className="flex items-center gap-0.5 ml-1">
              +
              {agentCaptures.map((t, i) => (
                <ChessPieceIcon
                  key={i}
                  type={t}
                  color="b"
                  className="w-3 h-3"
                />
              ))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-destructive">
          <span className="font-semibold">Black (Opponent)</span>
          <ChessPieceIcon type="K" color="b" className="w-3.5 h-3.5" />
          {opponentCaptures.length > 0 && (
            <span className="flex items-center gap-0.5 ml-1">
              +
              {opponentCaptures.map((t, i) => (
                <ChessPieceIcon
                  key={i}
                  type={t}
                  color="w"
                  className="w-3 h-3"
                />
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
