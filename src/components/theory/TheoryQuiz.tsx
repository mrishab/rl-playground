import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUIZ_QUESTIONS } from "./quizData";

export function TheoryQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = Object.keys(selectedAnswers).reduce((acc, qId) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === Number(qId));
    if (q && selectedAnswers[Number(qId)] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Undergraduate Mastery Quiz</CardTitle>
        {submitted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/30">
              Score: {score} / {QUIZ_QUESTIONS.length}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1"
              onClick={handleReset}
            >
              <RotateCcw className="h-3 w-3" /> Retry
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const selectedOpt = selectedAnswers[q.id];
          const isCorrect = selectedOpt === q.correctIndex;

          return (
            <div
              key={q.id}
              className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded">
                  Q{idx + 1}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {q.question}
                </span>
              </div>

              <div className="grid gap-1.5 pl-6">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOpt === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left p-2 rounded-md text-xs border transition-colors flex items-center justify-between ${
                        submitted && optIdx === q.correctIndex
                          ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium"
                          : submitted && isSelected && !isCorrect
                            ? "bg-destructive/15 border-destructive text-destructive font-medium"
                            : isSelected
                              ? "bg-primary/10 border-primary font-medium"
                              : "hover:bg-muted/40 border-border/70 text-muted-foreground"
                      }`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="pl-6 pt-1 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Explanation:{" "}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {!submitted && (
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              className="h-8 text-xs font-semibold"
              disabled={Object.keys(selectedAnswers).length === 0}
              onClick={() => setSubmitted(true)}
            >
              Submit Answers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
