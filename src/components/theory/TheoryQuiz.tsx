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
        {!submitted && (
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
        )}
      </CardContent>
    </Card>
  );
}
