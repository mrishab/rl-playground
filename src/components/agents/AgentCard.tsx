import { Play, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SavedRLAgent } from "@/types/savedAgent";
import { AgentCardHeader } from "./AgentCardHeader";
import { AgentCardStats } from "./AgentCardStats";

interface Props {
  agent: SavedRLAgent;
  onRename: (id: string, name: string) => void;
  onLoad: (agent: SavedRLAgent) => void;
  onDelete: (id: string) => void;
}

export function AgentCard({ agent, onRename, onLoad, onDelete }: Props) {
  return (
    <Card className="flex flex-col justify-between hover:border-primary/50 transition-[border-color] duration-150 ease-out">
      <AgentCardHeader agent={agent} onRename={onRename} />
      <CardContent className="space-y-3 pt-0">
        <AgentCardStats agent={agent} />
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
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(agent.id)}
            title="Delete Agent"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
