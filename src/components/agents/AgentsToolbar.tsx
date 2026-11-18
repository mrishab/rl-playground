import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AgentsToolbarButtons } from "./AgentsToolbarButtons";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onImport: (json: string) => void;
  onExport: () => void;
  onClearAll: () => void;
  hasAgents: boolean;
}

export function AgentsToolbar({
  searchQuery,
  onSearchChange,
  onImport,
  onExport,
  onClearAll,
  hasAgents,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9 text-xs"
        />
      </div>
      <AgentsToolbarButtons
        hasAgents={hasAgents}
        onImport={onImport}
        onExport={onExport}
        onClearAll={onClearAll}
      />
    </div>
  );
}
