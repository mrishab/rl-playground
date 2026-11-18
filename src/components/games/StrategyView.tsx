import type { StrategyState } from "@/lib/games/types";
import { STRATEGY_GRID_SIZE } from "@/lib/games/strategyEngine";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { StrategyGridSvg } from "./StrategyGridSvg";
import { StrategyNodesSvg } from "./StrategyNodesSvg";
import { StrategyUnitsSvg } from "./StrategyUnitsSvg";
import { StrategyStatusBar } from "./StrategyStatusBar";
import { GAME_CARD_SQUARE } from "./gameLayoutStyles";

interface Props {
  state: StrategyState;
}

export function StrategyView({ state }: Props) {
  const controller = useGamesStore((s) => s.controllerMode);
  const cellSize = 100 / STRATEGY_GRID_SIZE;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner gameId="strategy" controller={controller} />
      <div className={GAME_CARD_SQUARE}>
        <svg viewBox="0 0 100 100" className="w-full h-full select-none">
          <StrategyGridSvg obstacles={state.obstacles} cellSize={cellSize} />
          <StrategyNodesSvg nodes={state.nodes} cellSize={cellSize} />
          <StrategyUnitsSvg
            agent={state.agent}
            opponent={state.opponent}
            cellSize={cellSize}
          />
        </svg>
        <StrategyStatusBar
          agentHp={state.agent.health}
          oppHp={state.opponent.health}
          lastActionDesc={state.lastActionDesc}
        />
      </div>
    </div>
  );
}
