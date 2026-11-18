import type { PongState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { PongCourtSvg } from "./PongCourtSvg";
import { PONG_CARD_CONTAINER } from "./gameLayoutStyles";

interface Props {
  state: PongState;
}

export function PongView({ state }: Props) {
  const controller = useGamesStore((s) => s.controllerMode);

  return (
    <div className="space-y-3">
      <SearchComparisonBanner gameId="pong" controller={controller} />
      <div className={PONG_CARD_CONTAINER}>
        <PongCourtSvg state={state} />
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-muted-foreground/80">
          <span>Opponent (Left AI)</span>
          <span className="text-primary">RL Agent (Right Paddle)</span>
        </div>
      </div>
    </div>
  );
}
