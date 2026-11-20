import { Cpu } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { AgentsToolbar } from "./AgentsToolbar";
import { AgentsEmptyState } from "./AgentsEmptyState";
import { AgentCard } from "./AgentCard";
import { useSavedAgentsPage } from "./useSavedAgentsPage";

export function SavedAgentsPage() {
  const {
    agents,
    filteredAgents,
    searchQuery,
    setSearchQuery,
    deleteAgent,
    renameAgent,
    clearAll,
    handleImport,
    handleExport,
    handleLoad,
    downloadRef,
    navigate,
  } = useSavedAgentsPage();

  return (
    <PageLayout icon={Cpu} title="Saved Policies & Agents" hideActionGate>
      <a ref={downloadRef} className="hidden" aria-hidden="true" />
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
          searchQuery.trim().length > 0 ? (
            <div className="border border-dashed rounded-lg p-8 text-center space-y-2">
              <p className="text-sm font-semibold">
                No saved agents found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">
                Try a different name or algorithm filter.
              </p>
              <button
                type="button"
                className="text-xs text-primary underline font-medium hover:opacity-80 pt-1"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <AgentsEmptyState onGoToGridWorld={() => navigate("/gridworld")} />
          )
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
