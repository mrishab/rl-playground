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
    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/90 pt-1.5 border-t border-border/40 px-1 gap-1">
      <div className="flex items-center gap-1 text-primary shrink-0">
        <span className="font-semibold">Agent</span>
        <ChessPieceIcon type="K" color="w" className="w-3.5 h-3.5" />
        {agentCaptures.length > 0 && (
          <span className="flex items-center gap-0.5">
            +
            {agentCaptures.map((t, i) => (
              <ChessPieceIcon key={i} type={t} color="b" className="w-3 h-3" />
            ))}
          </span>
        )}
      </div>
      <div className="text-[10px] text-muted-foreground text-center font-medium px-1 flex-1 whitespace-nowrap">
        {statusText}
      </div>
      <div className="flex items-center gap-1 text-destructive shrink-0">
        <span className="font-semibold">Opp</span>
        <ChessPieceIcon type="K" color="b" className="w-3.5 h-3.5" />
        {opponentCaptures.length > 0 && (
          <span className="flex items-center gap-0.5">
            +
            {opponentCaptures.map((t, i) => (
              <ChessPieceIcon key={i} type={t} color="w" className="w-3 h-3" />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
