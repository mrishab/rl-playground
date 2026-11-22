import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  submitted: boolean;
  score: number;
  total: number;
  answeredCount: number;
  onSubmit: () => void;
  onReset: () => void;
}

export function TheoryQuizFooter({
  submitted,
  score,
  total,
  answeredCount,
  onSubmit,
  onReset,
}: Props) {
  if (!submitted) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/40">
        <span className="text-xs text-muted-foreground">
          {answeredCount === total
            ? "All questions answered. Ready to submit!"
            : `Answered ${answeredCount}/${total} questions (partial submissions allowed)`}
        </span>
        <Button
          size="sm"
          className="h-8 text-xs font-semibold"
          disabled={answeredCount === 0}
          onClick={onSubmit}
        >
          Submit Answers ({answeredCount}/{total})
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50">
      <span className="text-sm font-semibold font-mono bg-primary/10 text-primary px-3 py-1.5 rounded-md border border-primary/30">
        Final Score: {score} / {total} ({Math.round((score / total) * 100)}%)
      </span>
      <Button
        size="sm"
        variant="outline"
        className="h-9 text-xs gap-1.5 font-semibold"
        onClick={onReset}
      >
        <RotateCcw className="h-3.5 w-3.5" /> Retry Quiz
      </Button>
    </div>
  );
}
