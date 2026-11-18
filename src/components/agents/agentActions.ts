import { useRLStore } from "@/stores/rlStore";
import type { SavedRLAgent } from "@/types/savedAgent";

export function triggerAgentExport(
  json: string,
  anchor: HTMLAnchorElement | null,
) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  if (anchor) {
    anchor.href = url;
    anchor.download = `rl-agents-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}

export function loadAgentIntoRL(
  agent: SavedRLAgent,
  navigate: (path: string) => void,
) {
  const rl = useRLStore.getState();
  rl.setGridSize(agent.gridConfig.gridSize);
  useRLStore.setState({
    qTable: agent.qTable,
    totalEpisodes: agent.metrics.totalEpisodes,
    params: {
      ...rl.params,
      ...agent.hyperparameters,
      algorithm: agent.algorithm,
    },
  });
  navigate("/gridworld");
}
