import { useState } from "react";
import { Play, Trash2, Download, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SavedRLAgent } from "@/types/savedAgent";
import { AgentCardHeader } from "./AgentCardHeader";
import { AgentCardStats } from "./AgentCardStats";
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
          <div className="p-2 rounded bg-destructive/10 border border-destructive/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Confirm deleting this agent?</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-2"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-6 text-[10px] px-2"
                onClick={() => onDelete(agent.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1 pt-1 border-t">
            <Button
              size="sm"
              className="h-7 text-xs flex-1 gap-1"
              onClick={() => onLoad(agent)}
            >
              <Play className="h-3 w-3" /> Load Policy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={handleExportSingle}
              title="Export Agent JSON"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmingDelete(true)}
              title="Delete Agent"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
