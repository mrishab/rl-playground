import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedAgentsStore } from "@/stores/savedAgentsStore";
import type { SavedRLAgent } from "@/types/savedAgent";
import { triggerAgentExport, loadAgentIntoRL } from "./agentActions";

export function useSavedAgentsPage() {
  const navigate = useNavigate();
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const store = useSavedAgentsStore();
  const { agents, searchQuery, exportAgents, importAgents } = store;

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.algorithm.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleExport = () => {
    triggerAgentExport(exportAgents(), downloadRef.current);
  };

  const handleImport = (text: string) => {
    alert(`Imported ${importAgents(text)} agent(s).`);
  };

  const handleLoad = (agent: SavedRLAgent) => {
    loadAgentIntoRL(agent, navigate);
  };

  return {
    agents,
    filteredAgents,
    searchQuery,
    setSearchQuery: store.setSearchQuery,
    deleteAgent: store.deleteAgent,
    renameAgent: store.renameAgent,
    clearAll: store.clearAll,
    handleImport,
    handleExport,
    handleLoad,
    downloadRef,
    navigate,
  };
}
