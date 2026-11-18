import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  onChange: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function AgentRenameEditor({ name, onChange, onSave, onCancel }: Props) {
  return (
    <div className="flex items-center gap-1 w-full">
      <Input
        value={name}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 text-xs"
        autoFocus
      />
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0"
        onClick={onSave}
      >
        <Check className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0"
        onClick={onCancel}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
