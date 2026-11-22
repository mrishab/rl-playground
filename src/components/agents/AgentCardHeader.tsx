import { useState } from "react";
import { Edit2 } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SavedRLAgent } from "@/types/savedAgent";
import { AgentRenameEditor } from "./AgentRenameEditor";

interface Props {
  agent: SavedRLAgent;
  onRename: (id: string, name: string) => void;
}

export function AgentCardHeader({ agent, onRename }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(agent.name);

  const handleSave = () => {
    if (name.trim()) onRename(agent.id, name.trim());
    setIsEditing(false);
  };

  return (
    <CardHeader className="pb-2 space-y-1">
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <AgentRenameEditor
            name={name}
            onChange={setName}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex items-center gap-1.5 font-semibold text-sm min-w-0">
            <span className="truncate max-w-[180px]" title={agent.name}>
              {agent.name}
            </span>
            <button
              type="button"
              onClick={() => {
                setName(agent.name);
                setIsEditing(true);
              }}
              className="text-muted-foreground hover:text-foreground"
              title="Rename Agent"
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
  );
}
