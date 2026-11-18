import type { ChessState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { ChessBoardCell } from "./ChessBoardCell";
import { ChessScoreFooter } from "./ChessScoreFooter";
import { GAME_CARD_FLEX_COL } from "./gameLayoutStyles";

interface Props {
  state: ChessState;
}

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
      <div className={GAME_CARD_FLEX_COL}>
        <div className="grid grid-cols-4 grid-rows-4 w-full h-[88%] gap-1">
          {state.board.map((row, r) =>
            row.map((cell, c) => {
              const isLastFrom =
                state.lastMove?.from[0] === r && state.lastMove?.from[1] === c;
              const isLastTo =
                state.lastMove?.to[0] === r && state.lastMove?.to[1] === c;
              return (
                <ChessBoardCell
                  key={`${r}-${c}`}
                  r={r}
                  c={c}
                  cell={cell}
                  isLastFrom={Boolean(isLastFrom)}
                  isLastTo={Boolean(isLastTo)}
                />
              );
            }),
          )}
        </div>
        <ChessScoreFooter
          statusText={statusText}
          agentCaptures={state.agentCaptures}
          opponentCaptures={state.opponentCaptures}
        />
      </div>
    </div>
  );
}
