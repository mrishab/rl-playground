import { useState } from "react";
import { RotateCcw, BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLSaveResetButtons({ onResetQ, onSaveAgent }: Props) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!onSaveAgent) return;
    onSaveAgent();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const saveStyle = isSaved
    ? "border-success/50 bg-success/15 text-success font-medium hover:bg-success/20 hover:text-success"
    : "";

  return (
    <>
      {onSaveAgent && (
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
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 text-xs px-2 text-muted-foreground"
        onClick={onResetQ}
        title="Reset Q-Table"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </>
  );
}
