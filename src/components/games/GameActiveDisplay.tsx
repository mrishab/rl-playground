import { PongView } from "./PongView";
import { PacmanView } from "./PacmanView";
import { ChessView } from "./ChessView";
import { StrategyView } from "./StrategyView";
import type {
  GameId,
  PongState,
  PacmanState,
  ChessState,
  StrategyState,
} from "@/lib/games/types";

type Props = {
  activeGame: GameId;
  pongState: PongState;
  pacmanState: PacmanState;
  chessState: ChessState;
  strategyState: StrategyState;
};

export function GameActiveDisplay({
  activeGame,
  pongState,
  pacmanState,
  chessState,
  strategyState,
}: Props) {
  if (activeGame === "pong") {
    return <PongView state={pongState} />;
  }
  if (activeGame === "pacman") {
    return <PacmanView state={pacmanState} />;
  }
  if (activeGame === "chess") {
    return <ChessView state={chessState} />;
  }
  return <StrategyView state={strategyState} />;
}
