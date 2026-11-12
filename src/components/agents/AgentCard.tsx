import { useState } from "react";
import { Play, Trash2, Edit2, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { SavedRLAgent } from "@/types/savedAgent";

type Props = {
  agent: SavedRLAgent;
  onRename: (id: string, name: string) => void;
  onLoad: (agent: SavedRLAgent) => void;
  onDelete: (id: string) => void;
};

export function AgentCard({ agent, onRename, onLoad, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(agent.name);

  const handleSaveRename = () => {
    if (name.trim()) onRename(agent.id, name.trim());
    setIsEditing(false);
  };

  return (
    <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-start justify-between gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1 w-full">
              <Input
                size={1}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-7 text-xs"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={handleSaveRename}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-semibold text-sm">
              <span>{agent.name}</span>
              <button
                type="button"
                onClick={() => {
                  setName(agent.name);
                  setIsEditing(true);
                }}
                className="text-muted-foreground hover:text-foreground"
                title="Rename"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
          <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
            {agent.algorithm}
          </Badge>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {new Date(agent.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap gap-1 text-[10px] font-mono text-muted-foreground">
          <span className="bg-muted px-1.5 py-0.5 rounded">
            α: {agent.hyperparameters.learningRate}
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded">
            γ: {agent.hyperparameters.discountFactor}
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded">
            ε: {agent.hyperparameters.explorationRate}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-center text-xs bg-muted/30 p-2 rounded border font-mono">
          <div>
            <div className="text-[9px] text-muted-foreground uppercase">
              Episodes
            </div>
            <div className="font-bold">{agent.metrics.totalEpisodes}</div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase">
              Success Rate
            </div>
            <div className="font-bold text-primary">
              {agent.metrics.successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 pt-1 border-t">
          <Button
            size="sm"
            className="h-7 text-xs flex-1 gap-1"
            onClick={() => onLoad(agent)}
          >
            <Play className="h-3 w-3" /> Load in GridWorld
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
