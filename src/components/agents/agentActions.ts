import { useRLStore } from "@/stores/rlStore";
import type { SavedRLAgent } from "@/types/savedAgent";
import { simulateBFSAgainstObstacles } from "@/lib/rl/bfsSearch";

export function triggerAgentExport(
  json: string,
  anchor: HTMLAnchorElement | null,
  filename?: string,
) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  if (anchor) {
    anchor.href = url;
    anchor.download = filename || `rl-agents-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}

export function loadAgentIntoRL(
  agent: SavedRLAgent,
  navigate: (path: string) => void,
) {
  const rl = useRLStore.getState();
  const cfg = agent.gridConfig;
  const initialSmart = (
    cfg.initialSmartObstacles ||
    cfg.smartObstacles ||
    []
  ).map((o) => ({ ...o }));
  const currentSmart = (
    cfg.smartObstacles ||
    cfg.initialSmartObstacles ||
    []
  ).map((o) => ({ ...o }));

  const restoredRules = agent.rules
    ? { ...agent.rules, gridSize: cfg.gridSize }
    : { ...rl.rules, gridSize: cfg.gridSize };

  const bfs = simulateBFSAgainstObstacles(
    cfg.gridSize,
    cfg.startPos,
    cfg.goalPos,
    cfg.obstacles,
    initialSmart,
    cfg.hazards,
  );

  const totalEpisodes = agent.metrics.totalEpisodes;
  const successCount =
    agent.metrics.successCount ??
    Math.round(((agent.metrics.successRate || 0) / 100) * totalEpisodes);

  useRLStore.setState({
    gridSize: cfg.gridSize,
    startPos: [...cfg.startPos],
    agentPos: [...cfg.startPos],
    goalPos: [...cfg.goalPos],
    hazards: cfg.hazards.map(([r, c]) => [r, c]),
    obstacles: cfg.obstacles.map(([r, c]) => [r, c]),
    muds: (cfg.muds || []).map(([r, c]) => [r, c]),
    ices: (cfg.ices || []).map(([r, c]) => [r, c]),
    smartObstacles: currentSmart,
    initialSmartObstacles: initialSmart,
    rules: restoredRules,
    qTable: { ...agent.qTable },
    totalEpisodes,
    successCount,
    rewardHistory: agent.history?.rewardHistory
      ? [...agent.history.rewardHistory]
      : [],
    stepsHistory: agent.history?.stepsHistory
      ? [...agent.history.stepsHistory]
      : [],
    tdHistory: agent.history?.tdHistory ? [...agent.history.tdHistory] : [],
    bfsResult: bfs,
    isSimulating: false,
    inspectedCell: null,
    params: {
      ...rl.params,
      ...agent.hyperparameters,
      algorithm: agent.algorithm,
    },
  });
  navigate("/gridworld");
}
