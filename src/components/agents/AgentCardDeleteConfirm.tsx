import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export function AgentCardDeleteConfirm({ onCancel, onConfirm }: Props) {
  return (
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-6 text-[10px] px-2"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
