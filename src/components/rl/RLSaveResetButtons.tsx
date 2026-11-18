import { RotateCcw, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLSaveResetButtons({ onResetQ, onSaveAgent }: Props) {
  return (
    <>
      {onSaveAgent && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1"
          onClick={onSaveAgent}
          title="Save policy"
        >
          <BookmarkPlus className="h-3 w-3" /> Save Policy
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
