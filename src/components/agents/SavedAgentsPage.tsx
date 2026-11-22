import { Cpu } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { AgentsToolbar } from "./AgentsToolbar";
import { AgentsEmptyState } from "./AgentsEmptyState";
import { AgentsSearchEmpty } from "./AgentsSearchEmpty";
import { AgentCard } from "./AgentCard";
import { useSavedAgentsPage } from "./useSavedAgentsPage";

export function SavedAgentsPage() {
  const p = useSavedAgentsPage();

  return (
    <PageLayout icon={Cpu} title="Saved Policies & Agents" hideActionGate>
      <a ref={p.downloadRef} className="hidden" aria-hidden="true" />
      <div className="space-y-3 max-w-6xl mx-auto w-full">
        <AgentsToolbar
          searchQuery={p.searchQuery}
          onSearchChange={p.setSearchQuery}
          onImport={p.handleImport}
          onExport={p.handleExport}
          onClearAll={() => {
            if (confirm("Delete all saved agents?")) p.clearAll();
          }}
          hasAgents={p.agents.length > 0}
        />
        {p.filteredAgents.length === 0 ? (
          p.searchQuery.trim().length > 0 ? (
            <AgentsSearchEmpty
              query={p.searchQuery}
              onClear={() => p.setSearchQuery("")}
            />
          ) : (
            <AgentsEmptyState
              onGoToGridWorld={() => p.navigate("/gridworld")}
            />
          )
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRename={p.renameAgent}
                onLoad={p.handleLoad}
                onDelete={p.deleteAgent}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
