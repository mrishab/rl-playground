import { PongView } from "./PongView";
import { PacmanView } from "./PacmanView";
import { ChessView } from "./ChessView";
import type {
  GameId,
  PongState,
  PacmanState,
  ChessState,
} from "@/lib/games/types";

type Props = {
  activeGame: GameId;
  pongState: PongState;
  pacmanState: PacmanState;
  chessState: ChessState;
};

export function GameActiveDisplay({
  activeGame,
  pongState,
  pacmanState,
  chessState,
}: Props) {
  if (activeGame === "pong") {
    return <PongView state={pongState} />;
  }
  if (activeGame === "pacman") {
    return <PacmanView state={pacmanState} />;
  }
  return <ChessView state={chessState} />;
}
