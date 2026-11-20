import { RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUIZ_QUESTIONS } from "./quizData";
import { useTheoryQuiz } from "./useTheoryQuiz";
import { TheoryQuizHeader } from "./TheoryQuizHeader";
import { TheoryQuizItem } from "./TheoryQuizItem";

export function TheoryQuiz() {
  const {
    selectedAnswers,
    submitted,
    score,
    selectOption,
    resetQuiz,
    submitQuiz,
  } = useTheoryQuiz();

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;

  return (
    <Card className="border-primary/30">
      <TheoryQuizHeader
        submitted={submitted}
        score={score}
        onReset={resetQuiz}
      />
      <CardContent className="space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => (
          <TheoryQuizItem
            key={q.id}
            q={q}
            index={idx}
            selectedOpt={selectedAnswers[q.id]}
            submitted={submitted}
            onSelect={(optIdx) => selectOption(q.id, optIdx)}
          />
        ))}
        {!submitted ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <span className="text-xs text-muted-foreground">
              {allAnswered
                ? "All questions answered. Ready to submit!"
                : `Answer all questions to submit (${answeredCount}/${QUIZ_QUESTIONS.length})`}
            </span>
            <Button
              size="sm"
              className="h-8 text-xs font-semibold"
              disabled={!allAnswered}
              onClick={submitQuiz}
            >
              Submit Answers ({answeredCount}/${QUIZ_QUESTIONS.length})
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50">
            <span className="text-sm font-semibold font-mono bg-primary/10 text-primary px-3 py-1.5 rounded-md border border-primary/30">
              Final Score: {score} / {QUIZ_QUESTIONS.length} (
              {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-9 text-xs gap-1.5 font-semibold"
              onClick={resetQuiz}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retry Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
