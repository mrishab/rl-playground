import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RLSaveAgentButton } from "./RLSaveAgentButton";

interface Props {
  onResetQ: () => void;
  onSaveAgent?: () => void;
}

export function RLSaveResetButtons({ onResetQ, onSaveAgent }: Props) {
  return (
    <>
      {onSaveAgent && <RLSaveAgentButton onSave={onSaveAgent} />}
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
