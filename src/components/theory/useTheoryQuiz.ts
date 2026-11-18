import { useState } from "react";
import { QUIZ_QUESTIONS } from "./quizData";

export type QuizAnswerMap = Record<number, number>;

export function useTheoryQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<QuizAnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const selectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const submitQuiz = () => setSubmitted(true);

  const score = Object.keys(selectedAnswers).reduce((acc, qId) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === Number(qId));
    if (q && selectedAnswers[Number(qId)] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return {
    selectedAnswers,
    submitted,
    score,
    selectOption,
    resetQuiz,
    submitQuiz,
  };
}
