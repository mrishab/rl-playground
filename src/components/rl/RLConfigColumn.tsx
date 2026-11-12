import { RLEnvironmentRulesCard } from "./RLEnvironmentRulesCard";
import { RLSmartObstaclesCard } from "./RLSmartObstaclesCard";
import { RLControlsCard } from "./RLControlsCard";
import type { useRLStore } from "@/stores/rlStore";
import { useSavedAgentsStore } from "@/stores/savedAgentsStore";

type Props = {
  store: ReturnType<typeof useRLStore.getState>;
};

export function RLConfigColumn({ store }: Props) {
  const saveAgent = useSavedAgentsStore((s) => s.saveAgent);

  const handleSaveAgent = () => {
    const rate =
      store.totalEpisodes > 0
        ? (store.successCount / store.totalEpisodes) * 100
        : 0;
    const finalReward =
      store.rewardHistory.length > 0
        ? store.rewardHistory[store.rewardHistory.length - 1]
        : 0;
    const avgSteps =
      store.stepsHistory.length > 0
        ? store.stepsHistory.reduce((a, b) => a + b, 0) /
          store.stepsHistory.length
        : 0;

    const agent = saveAgent({
      name: `${store.params.algorithm.toUpperCase()} Agent (${store.gridSize}x${store.gridSize})`,
      algorithm: store.params.algorithm,
      algorithmName: store.params.algorithm.toUpperCase(),
      hyperparameters: {
        learningRate: store.params.learningRate,
        discountFactor: store.params.discountFactor,
        explorationRate: store.params.explorationRate,
      },
      metrics: {
        totalEpisodes: store.totalEpisodes,
        successRate: rate,
        finalReward,
        averageSteps: Math.round(avgSteps),
      },
      gridConfig: {
        gridSize: store.gridSize,
        startPos: store.startPos,
        goalPos: store.goalPos,
        hazards: store.hazards,
        obstacles: store.obstacles,
      },
      qTable: store.qTable,
    });

    alert(`Saved agent "${agent.name}" to Saved Policies!`);
  };

  return (
    <div className="space-y-4">
      <RLEnvironmentRulesCard
        rules={store.rules}
        gridSize={store.gridSize}
        onSetGridSize={store.setGridSize}
        onChange={store.setRules}
        onPreset={store.loadPreset}
      />
      <RLSmartObstaclesCard
        activeStrategy={store.activeStrategy}
        onSelectStrategy={store.setActiveStrategy}
        smartObstacles={store.smartObstacles}
        onUpdateStrategy={store.updateObstacleStrategy}
        onRemove={store.removeSmartObstacle}
      />
      <RLControlsCard
        params={store.params}
        isSimulating={store.isSimulating}
        onChange={store.setParams}
        onTrain={store.trainEpisodes}
        onStep={store.stepSimulation}
        onStepTransition={store.stepSingleTransition}
        onToggleSimulate={() => store.setSimulating(!store.isSimulating)}
        onResetQ={store.resetQTable}
        onSaveAgent={handleSaveAgent}
      />
    </div>
  );
}
