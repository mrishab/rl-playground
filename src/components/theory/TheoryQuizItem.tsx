import type { QuizQuestion } from "./quizData";
import { TheoryQuizFeedback } from "./TheoryQuizFeedback";
import { TheoryQuizOption } from "./TheoryQuizOption";

interface Props {
  q: QuizQuestion;
  index: number;
  selectedOpt?: number;
  submitted: boolean;
  onSelect: (optionIdx: number) => void;
}

export function TheoryQuizItem({
  q,
  index,
  selectedOpt,
  submitted,
  onSelect,
}: Props) {
  const isAnswered = selectedOpt !== undefined;
  const isCorrect = isAnswered && selectedOpt === q.correctIndex;

  return (
    <div className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-2">
        <span className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded">
          Q{index + 1}
        </span>
        <span className="text-xs font-semibold text-foreground">
          {q.question}
        </span>
      </div>
      <div className="grid gap-1.5 pl-6">
        {q.options.map((opt, optIdx) => (
          <TheoryQuizOption
            key={optIdx}
            opt={opt}
            optIdx={optIdx}
            isSelected={selectedOpt === optIdx}
            isCorrect={optIdx === q.correctIndex}
            isAnswered={isAnswered}
            submitted={submitted}
            onSelect={onSelect}
          />
        ))}
      </div>
      {submitted && (
        <TheoryQuizFeedback
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          explanation={q.explanation}
        />
      )}
    </div>
  );
}
