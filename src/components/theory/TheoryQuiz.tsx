import { Card, CardContent } from "@/components/ui/card";
import { QUIZ_QUESTIONS } from "./quizData";
import { useTheoryQuiz } from "./useTheoryQuiz";
import { TheoryQuizHeader } from "./TheoryQuizHeader";
import { TheoryQuizItem } from "./TheoryQuizItem";
import { TheoryQuizFooter } from "./TheoryQuizFooter";

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
        <TheoryQuizFooter
          submitted={submitted}
          score={score}
          total={QUIZ_QUESTIONS.length}
          answeredCount={answeredCount}
          onSubmit={submitQuiz}
          onReset={resetQuiz}
        />
      </CardContent>
    </Card>
  );
}
