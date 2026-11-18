import type { useRLStore } from "@/stores/rlStore";
import type { useSavedAgentsStore } from "@/stores/savedAgentsStore";

export function saveCurrentRLAgent(
  store: ReturnType<typeof useRLStore.getState>,
  saveAgent: ReturnType<typeof useSavedAgentsStore.getState>["saveAgent"],
) {
  const rate =
    store.totalEpisodes > 0
      ? (store.successCount / store.totalEpisodes) * 100
      : 0;
  const finalReward =
    store.rewardHistory.length > 0
      ? (store.rewardHistory[store.rewardHistory.length - 1] ?? 0)
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
}
