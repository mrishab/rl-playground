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
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              className="h-8 text-xs font-semibold"
              disabled={Object.keys(selectedAnswers).length === 0}
              onClick={submitQuiz}
            >
              Submit Answers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
