import type { IceMazeState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { IceMazeGrid } from "./IceMazeGrid";
import { IceMazeControls } from "./IceMazeControls";

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
      <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 p-2.5 shadow-inner flex flex-col justify-between">
        <div className="w-full h-[76%]">
          <IceMazeGrid state={state} />
        </div>
        <IceMazeControls state={state} onSlipChange={setSlipRate} />
      </div>
    </div>
  );
}
