import type { ChessPieceType } from "@/lib/games/types";
import { ChessCaptureList } from "./ChessCaptureList";

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
        className="text-[11px] text-foreground text-center font-semibold break-words leading-tight"
        title={statusText}
      >
        {statusText}
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <ChessCaptureList
          label="White (Agent)"
          pieceColor="w"
          captures={agentCaptures}
          captureColor="b"
          textColor="text-primary"
        />
        <ChessCaptureList
          label="Black (Opponent)"
          pieceColor="b"
          captures={opponentCaptures}
          captureColor="w"
          textColor="text-destructive"
        />
      </div>
    </div>
  );
}
