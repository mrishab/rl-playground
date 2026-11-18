import type { ChessPieceType } from "@/lib/games/types";
import { CHESS_SYMBOLS } from "./chessSymbols";

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
  const agentCaps = agentCaptures.map((t) => CHESS_SYMBOLS[`b-${t}`]).join("");
  const oppCaps = opponentCaptures.map((t) => CHESS_SYMBOLS[`w-${t}`]).join("");

  return (
    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/90 pt-1 border-t border-border/40 px-1">
      <span className="text-primary truncate max-w-[100px]">
        Agent ♔ {agentCaps && `+${agentCaps}`}
      </span>
      <span className="text-[9px] text-muted-foreground text-center truncate max-w-[120px]">
        {statusText}
      </span>
      <span className="text-destructive truncate max-w-[100px]">
        Opp ♚ {oppCaps && `+${oppCaps}`}
      </span>
    </div>
  );
}
