import { RotateCcw } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUIZ_QUESTIONS } from "./quizData";

interface Props {
  submitted: boolean;
  score: number;
  onReset: () => void;
}

export function TheoryQuizHeader({ submitted, score, onReset }: Props) {
  return (
    <CardHeader className="pb-3 flex flex-row items-center justify-between">
      <CardTitle className="text-base">Mastery Quiz</CardTitle>
      {submitted && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/30">
            Score: {score} / {QUIZ_QUESTIONS.length}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1"
            onClick={onReset}
          >
            <RotateCcw className="h-3 w-3" /> Retry Quiz
          </Button>
        </div>
      )}
    </CardHeader>
  );
}
