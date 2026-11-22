interface Props {
  isAnswered: boolean;
  isCorrect: boolean;
  explanation: string;
}

export function TheoryQuizFeedback({
  isAnswered,
  isCorrect,
  explanation,
}: Props) {
  return (
    <div className="pl-6 pt-1 text-[11px] text-muted-foreground">
      <span className="font-semibold text-foreground">
        {!isAnswered ? (
          <span className="text-warning font-bold mr-1">
            ⚠ Unanswered (0 pts)
          </span>
        ) : isCorrect ? (
          <span className="text-success font-bold mr-1">✓ Correct!</span>
        ) : (
          <span className="text-destructive font-bold mr-1">✗ Incorrect.</span>
        )}
        Explanation:{" "}
      </span>
      {explanation}
    </div>
  );
}
