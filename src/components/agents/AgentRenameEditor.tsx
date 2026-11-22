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
        maxLength={40}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (name.trim()) onSave();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        className="h-7 text-xs"
        autoFocus
      />
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0"
        disabled={!name.trim()}
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
