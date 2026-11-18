import { RLEnvironmentRulesCard } from "./RLEnvironmentRulesCard";
import { RLSmartObstaclesCard } from "./RLSmartObstaclesCard";
import { RLControlsCard } from "./RLControlsCard";
import type { useRLStore } from "@/stores/rlStore";
import { useSavedAgentsStore } from "@/stores/savedAgentsStore";
import { saveCurrentRLAgent } from "./rlSaveAgent";

interface Props {
  store: ReturnType<typeof useRLStore.getState>;
}

export function RLConfigColumn({ store }: Props) {
  const saveAgent = useSavedAgentsStore((s) => s.saveAgent);

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
        onSaveAgent={() => saveCurrentRLAgent(store, saveAgent)}
      />
    </div>
  );
}
