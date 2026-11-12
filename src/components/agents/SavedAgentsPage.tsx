import { useNavigate } from "react-router-dom";
import { Cpu } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { useSavedAgentsStore } from "@/stores/savedAgentsStore";
import { useRLStore } from "@/stores/rlStore";
import type { SavedRLAgent } from "@/types/savedAgent";
import { AgentsToolbar } from "./AgentsToolbar";
import { AgentsEmptyState } from "./AgentsEmptyState";
import { AgentCard } from "./AgentCard";

export function SavedAgentsPage() {
  const navigate = useNavigate();
  const {
    agents,
    searchQuery,
    deleteAgent,
    renameAgent,
    clearAll,
    importAgents,
    exportAgents,
    setSearchQuery,
  } = useSavedAgentsStore();

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.algorithm.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleExport = () => {
    const json = exportAgents();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rl-agents-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (text: string) => {
    const count = importAgents(text);
    alert(`Successfully imported ${count} RL agent(s)!`);
  };

  const handleLoad = (agent: SavedRLAgent) => {
    const rlState = useRLStore.getState();
    rlState.setGridSize(agent.gridConfig.gridSize);
    useRLStore.setState({
      qTable: agent.qTable,
      totalEpisodes: agent.metrics.totalEpisodes,
      params: {
        ...rlState.params,
        ...agent.hyperparameters,
        algorithm: agent.algorithm,
      },
    });
    navigate("/gridworld");
  };

  return (
    <PageLayout icon={Cpu} title="Saved Policies & Agents" hideActionGate>
      <div className="space-y-3 max-w-6xl mx-auto w-full">
        <AgentsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onImport={handleImport}
          onExport={handleExport}
          onClearAll={() => {
            if (confirm("Delete all saved agents?")) clearAll();
          }}
          hasAgents={agents.length > 0}
        />
        {filteredAgents.length === 0 ? (
          <AgentsEmptyState onGoToGridWorld={() => navigate("/gridworld")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRename={renameAgent}
                onLoad={handleLoad}
                onDelete={deleteAgent}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
