import { Button } from "@/components/ui/button";
import { RL_TOOLS, type EditTool } from "./rlTools";

export type { EditTool } from "./rlTools";

interface Props {
  activeTool: EditTool;
  onSelectTool: (tool: EditTool) => void;
  onResetEnv: () => void;
}

export function RLToolBar({ activeTool, onSelectTool, onResetEnv }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2">
      <div className="flex flex-wrap items-center gap-1">
        {RL_TOOLS.map(({ tool, label, icon: Icon }) => (
          <Button
            key={tool}
            size="sm"
            variant={activeTool === tool ? "default" : "outline"}
            className="h-7 text-xs px-2 gap-1"
            onClick={() => onSelectTool(tool)}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 text-xs text-muted-foreground"
        onClick={onResetEnv}
      >
        Reset Grid
      </Button>
    </div>
  );
}
