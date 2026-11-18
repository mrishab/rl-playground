import { PongView } from "./PongView";
import { PacmanView } from "./PacmanView";
import { ChessView } from "./ChessView";
import { StrategyView } from "./StrategyView";
import { IceMazeView } from "./IceMazeView";
import { SlotMachineView } from "./SlotMachineView";
import { LemonadeStandView } from "./LemonadeStandView";
import { ContinuousCarView } from "./ContinuousCarView";
import type {
  ChessState,
  ContinuousCarState,
  GameId,
  IceMazeState,
  LemonadeState,
  PacmanState,
  PongState,
  SlotMachineState,
  StrategyState,
} from "@/lib/games/types";

type Props = {
  activeGame: GameId;
  pongState: PongState;
  pacmanState: PacmanState;
  chessState: ChessState;
  strategyState: StrategyState;
  iceMazeState: IceMazeState;
  slotMachineState: SlotMachineState;
  lemonadeState: LemonadeState;
  continuousCarState: ContinuousCarState;
};

export function GameActiveDisplay({
  activeGame,
  pongState,
  pacmanState,
  chessState,
  strategyState,
  iceMazeState,
  slotMachineState,
  lemonadeState,
  continuousCarState,
}: Props) {
  if (activeGame === "pong") return <PongView state={pongState} />;
  if (activeGame === "pacman") return <PacmanView state={pacmanState} />;
  if (activeGame === "chess") return <ChessView state={chessState} />;
  if (activeGame === "strategy") return <StrategyView state={strategyState} />;
  if (activeGame === "ice-maze") return <IceMazeView state={iceMazeState} />;
  if (activeGame === "slot-machine")
    return <SlotMachineView state={slotMachineState} />;
  if (activeGame === "lemonade")
    return <LemonadeStandView state={lemonadeState} />;
  return <ContinuousCarView state={continuousCarState} />;
}
