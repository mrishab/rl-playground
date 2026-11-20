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

  return saveAgent({
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
      successCount: store.successCount,
      successRate: rate,
      finalReward,
      averageSteps: Math.round(avgSteps),
    },
    gridConfig: {
      gridSize: store.gridSize,
      startPos: [...store.startPos],
      goalPos: [...store.goalPos],
      hazards: store.hazards.map(([r, c]) => [r, c]),
      obstacles: store.obstacles.map(([r, c]) => [r, c]),
      muds: (store.muds || []).map(([r, c]) => [r, c]),
      ices: (store.ices || []).map(([r, c]) => [r, c]),
      smartObstacles: store.smartObstacles.map((o) => ({ ...o })),
      initialSmartObstacles: store.initialSmartObstacles.map((o) => ({ ...o })),
    },
    rules: { ...store.rules },
    history: {
      rewardHistory: [...store.rewardHistory],
      stepsHistory: [...store.stepsHistory],
      tdHistory: [...store.tdHistory],
    },
    qTable: { ...store.qTable },
  });
}
