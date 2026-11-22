import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { SavedRLAgent } from "@/types/savedAgent";
import { AgentCardHeader } from "./AgentCardHeader";
import { AgentCardStats } from "./AgentCardStats";
import { AgentCardDeleteConfirm } from "./AgentCardDeleteConfirm";
import { AgentCardActions } from "./AgentCardActions";
import { triggerAgentExport } from "./agentActions";

interface Props {
  agent: SavedRLAgent;
  onRename: (id: string, name: string) => void;
  onLoad: (agent: SavedRLAgent) => void;
  onDelete: (id: string) => void;
}

export function AgentCard({ agent, onRename, onLoad, onDelete }: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleExportSingle = () => {
    const json = JSON.stringify([agent], null, 2);
    const a = document.createElement("a");
    triggerAgentExport(
      json,
      a,
      `${agent.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`,
    );
  };

  return (
    <Card className="flex flex-col justify-between hover:border-primary/50 transition-[border-color] duration-150 ease-out">
      <AgentCardHeader agent={agent} onRename={onRename} />
      <CardContent className="space-y-3 pt-0">
        <AgentCardStats agent={agent} />
        {confirmingDelete ? (
          <AgentCardDeleteConfirm
            onCancel={() => setConfirmingDelete(false)}
            onConfirm={() => onDelete(agent.id)}
          />
        ) : (
          <AgentCardActions
            onLoad={() => onLoad(agent)}
            onExport={handleExportSingle}
            onDeleteClick={() => setConfirmingDelete(true)}
          />
        )}
      </CardContent>
    </Card>
  );
}
