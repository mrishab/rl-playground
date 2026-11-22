import { useState, useRef, useEffect } from "react";
import { BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RLSaveAgentButton({ onSave }: { onSave: () => void }) {
  const [isSaved, setIsSaved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSave = () => {
    onSave();
    setIsSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsSaved(false), 2000);
  };

  const saveStyle = isSaved
    ? "border-success/50 bg-success/15 text-success font-medium hover:bg-success/20 hover:text-success"
    : "";

  return (
    <Button
      size="sm"
      variant="outline"
      className={`h-8 text-xs gap-1 transition-[color,background-color,border-color] duration-150 ease-out ${saveStyle}`}
      onClick={handleSave}
      title="Save policy to Agents"
    >
      {isSaved ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <BookmarkPlus className="h-3 w-3" />
      )}
      <span>{isSaved ? "Saved!" : "Save Policy"}</span>
    </Button>
  );
}
