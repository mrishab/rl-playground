import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentsImportButton } from "./AgentsImportButton";

interface Props {
  hasAgents: boolean;
  onImport: (json: string) => void;
  onExport: () => void;
  onClearAll: () => void;
}

export function AgentsToolbarButtons({
  hasAgents,
  onImport,
  onExport,
  onClearAll,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
      <AgentsImportButton onImport={onImport} />
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        onClick={onExport}
        disabled={!hasAgents}
      >
        <Download className="h-3.5 w-3.5" /> Export Agents
      </Button>
      {hasAgents && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs text-destructive hover:bg-destructive/10"
          onClick={onClearAll}
        >
          Clear Agents
        </Button>
      )}
    </div>
  );
}
