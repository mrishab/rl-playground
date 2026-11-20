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
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground/80 px-1 pt-1 border-t border-border/40">
        <span>Opponent (Left AI)</span>
        <span className="text-primary font-semibold">
          RL Agent (Right Paddle)
        </span>
      </div>
    </div>
  );
}
