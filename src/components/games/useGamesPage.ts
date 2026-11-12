import { useGamesStore } from "@/stores/gamesStore";
import { useGameLoop } from "./hooks/useGameLoop";

export function useGamesPage() {
  useGameLoop();
  const activeGame = useGamesStore((s) => s.activeGame);
  const isPlaying = useGamesStore((s) => s.isPlaying);
  const speed = useGamesStore((s) => s.speed);
  const hyperparams = useGamesStore((s) => s.hyperparams);
  const pongState = useGamesStore((s) => s.pongState);
  const pacmanState = useGamesStore((s) => s.pacmanState);
  const chessState = useGamesStore((s) => s.chessState);
  const strategyState = useGamesStore((s) => s.strategyState);
  const metrics = useGamesStore((s) => s.metrics[s.activeGame]);

  const setActiveGame = useGamesStore((s) => s.setActiveGame);
  const setHyperparams = useGamesStore((s) => s.setHyperparams);
  const togglePlay = useGamesStore((s) => s.togglePlay);
  const setSpeed = useGamesStore((s) => s.setSpeed);
  const stepSingle = useGamesStore((s) => s.stepSingle);
  const trainBatch = useGamesStore((s) => s.trainBatch);
  const resetEpisode = useGamesStore((s) => s.resetEpisode);
  const resetAll = useGamesStore((s) => s.resetAll);

  return {
    activeGame,
    isPlaying,
    speed,
    hyperparams,
    pongState,
    pacmanState,
    chessState,
    strategyState,
    metrics,
    setActiveGame,
    setHyperparams,
    togglePlay,
    setSpeed,
    stepSingle,
    trainBatch,
    resetEpisode,
    resetAll,
  };
}
