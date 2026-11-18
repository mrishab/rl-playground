import type { PacmanState } from "@/lib/games/types";
import { PACMAN_GRID_SIZE } from "@/lib/games/pacmanEngine";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { PacmanMazeSvg } from "./PacmanMazeSvg";
import { PacmanStatusFooter } from "./PacmanStatusFooter";
import { GAME_CARD_FLEX_COL } from "./gameLayoutStyles";

interface Props {
  state: PacmanState;
}

export function PacmanView({ state }: Props) {
  const controller = useGamesStore((s) => s.controllerMode);
  const cellSize = 100 / PACMAN_GRID_SIZE;
  const status = state.isOver
    ? state.won
      ? "Maze Cleared!"
      : "Caught by Ghost"
    : state.frightenedTimer > 0
      ? `Power Active (${state.frightenedTimer})`
      : `Pellets: ${state.pelletsRemaining}`;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner gameId="pacman" controller={controller} />
      <div className={GAME_CARD_FLEX_COL}>
        <PacmanMazeSvg state={state} cellSize={cellSize} />
        <PacmanStatusFooter
          score={state.score}
          status={status}
          isFrightened={state.frightenedTimer > 0}
          ghostsEaten={state.ghostsEaten}
        />
      </div>
    </div>
  );
}
