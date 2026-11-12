import { Gamepad2 } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { GameTabBar } from "./GameTabBar";
import { GameControlsRow } from "./GameControlsRow";
import { GameMetricsRow } from "./GameMetricsRow";
import { GameActiveDisplay } from "./GameActiveDisplay";
import { GameHyperparamsCard } from "./GameHyperparamsCard";
import { useGamesPage } from "./useGamesPage";

export function GamesPage() {
  const p = useGamesPage();

  return (
    <PageLayout
      icon={Gamepad2}
      title="Competitive RL Games"
      subtitle="Train reinforcement learning agents to beat opponents, navigate mazes, and master classic games"
    >
      <div className="space-y-4 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <GameTabBar activeGame={p.activeGame} onSelect={p.setActiveGame} />
        </div>

        <GameMetricsRow metrics={p.metrics} />

        <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur space-y-4">
          <GameControlsRow
            isPlaying={p.isPlaying}
            speed={p.speed}
            onTogglePlay={p.togglePlay}
            onStep={p.stepSingle}
            onTrain={p.trainBatch}
            onReset={p.resetEpisode}
            onSetSpeed={p.setSpeed}
          />

          <GameActiveDisplay
            activeGame={p.activeGame}
            pongState={p.pongState}
            pacmanState={p.pacmanState}
            chessState={p.chessState}
          />

          <GameHyperparamsCard
            params={p.hyperparams}
            onChange={p.setHyperparams}
          />
        </div>
      </div>
    </PageLayout>
  );
}
