import { Play, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onLoad: () => void;
  onExport: () => void;
  onDeleteClick: () => void;
}

export function AgentCardActions({ onLoad, onExport, onDeleteClick }: Props) {
  return (
    <div className="flex items-center justify-between gap-1 pt-1 border-t">
      <Button size="sm" className="h-7 text-xs flex-1 gap-1" onClick={onLoad}>
        <Play className="h-3 w-3" /> Load Policy
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        onClick={onExport}
        title="Export Agent JSON"
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
        onClick={onDeleteClick}
        title="Delete Agent"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
