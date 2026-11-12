import { useRef } from "react";
import { Search, Upload, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onImport: (json: string) => void;
  onExport: () => void;
  onClearAll: () => void;
  hasAgents: boolean;
};

export function AgentsToolbar({
  searchQuery,
  onSearchChange,
  onImport,
  onExport,
  onClearAll,
  hasAgents,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) onImport(text);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search agents by name or algorithm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" /> Import JSON
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1"
          onClick={onExport}
          disabled={!hasAgents}
        >
          <Download className="h-3.5 w-3.5" /> Export All
        </Button>
        {hasAgents && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-destructive hover:bg-destructive/10"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
