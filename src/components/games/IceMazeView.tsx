import type { IceMazeState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { IceMazeGrid } from "./IceMazeGrid";
import { IceMazeControls } from "./IceMazeControls";
import { GAME_CARD_FLEX_COL } from "./gameLayoutStyles";

type Props = {
  state: IceMazeState;
};

export function IceMazeView({ state }: Props) {
  const setSlipRate = useGamesStore((s) => s.setIceMazeSlipRate);
  const failureNotice =
    state.isOver && !state.won
      ? state.controller === "search"
        ? "A* Plan Failed (Slipped into Pit)"
        : "Episode Over"
      : null;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner
        gameId="ice-maze"
        controller={state.controller}
        failureNotice={failureNotice}
      />
      <div className={GAME_CARD_FLEX_COL}>
        <div className="w-full h-[76%]">
          <IceMazeGrid state={state} />
        </div>
        <IceMazeControls state={state} onSlipChange={setSlipRate} />
      </div>
    </div>
  );
}
