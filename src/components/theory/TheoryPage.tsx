import { useState } from "react";
import { BookOpen, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary difference between Q-Learning and SARSA?",
    options: [
      "Q-learning is model-based, while SARSA is model-free.",
      "Q-learning is off-policy using max_a' Q(s', a'), while SARSA is on-policy using Q(s', a') from the chosen policy.",
      "SARSA cannot be used on episodic tasks.",
      "Q-learning only works with deterministic transitions.",
    ],
    correctIndex: 1,
    explanation:
      "Correct! Q-Learning evaluates target updates using the greedy maximum Q-value of the next state (off-policy), whereas SARSA updates based on the actual next action chosen by its current behavior policy (on-policy).",
  },
  {
    id: 2,
    question:
      "Why does SARSA choose a safer path than Q-Learning in the Cliff Walking experiment?",
    options: [
      "SARSA has a lower learning rate.",
      "SARSA accounts for epsilon-greedy exploration mistakes during training, penalizing paths close to the cliff edge.",
      "Q-learning cannot handle negative rewards.",
      "SARSA always uses greedy action selection without exploration.",
    ],
    correctIndex: 1,
    explanation:
      "Exactly! Because SARSA is on-policy, it experiences the negative reward of falling off the cliff when random epsilon exploration occurs near the cliff, learning the safer top route. Q-Learning learns the optimal edge route assuming purely greedy subsequent moves.",
  },
  {
    id: 3,
    question:
      "What causes 'Maximization Bias' in standard Q-Learning, and how does Double Q-Learning address it?",
    options: [
      "Maximization bias occurs because rewards are bounded; Double Q-Learning removes the reward bounds.",
      "Maximization bias arises from using the same values to select and evaluate an action (E[max(X, Y)] >= max(E[X], E[Y])); Double Q-learning decouples selection and evaluation using two separate tables.",
      "Maximization bias is caused by discount factors greater than 1.0.",
      "Double Q-learning runs two agents simultaneously on two separate grids.",
    ],
    correctIndex: 1,
    explanation:
      "Spot on! Using max over noisy estimates causes overestimation bias. Double Q-Learning maintains two independent estimators (QA and QB), using one to determine the best action and the other to estimate its value.",
  },
  {
    id: 4,
    question:
      "In the Multi-Armed Bandit problem, what is the key concept behind Upper Confidence Bound (UCB)?",
    options: [
      "Only pull the arm with the highest sample mean.",
      "Optimism in the face of uncertainty: arms pulled fewer times receive an exploration bonus proportional to √(ln t / N(a)).",
      "Assign equal probability to all arms regardless of reward history.",
      "Randomly reset the reward estimates every 100 steps.",
    ],
    correctIndex: 1,
    explanation:
      "Right! UCB selects actions based on the upper bound of their confidence intervals, naturally driving the agent to explore arms with high potential or high uncertainty.",
  },
  {
    id: 5,
    question:
      "What is required by Dynamic Programming algorithms (Value Iteration) that is NOT required by Model-Free RL (Q-Learning)?",
    options: [
      "A neural network function approximator.",
      "Full knowledge of the environment transition dynamics P(s'|s,a) and reward function R(s,a).",
      "An epsilon-greedy exploration schedule.",
      "Continuous state and action spaces.",
    ],
    correctIndex: 1,
    explanation:
      "Correct! Dynamic Programming is a model-based planning technique requiring complete mathematical transition probabilities and expected reward models, whereas Q-Learning learns directly from sampled experience.",
  },
];

export function TheoryPage() {
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
    <PageLayout
      icon={BookOpen}
      title="Undergraduate RL Theory & Interactive Self-Check"
      subtitle="Mathematical foundations, Bellman equations, algorithmic comparisons, and conceptual mastery"
      hideActionGate
    >
      <div className="space-y-6 max-w-5xl mx-auto w-full">
        {/* Core Concepts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Concept 1: MDP */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                1. Markov Decision Processes (MDP)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                An MDP formalizes sequential decision making under uncertainty
                as a 5-tuple:
              </p>
              <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
                (S, A, P, R, γ)
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>S:</strong> Set of all valid environment states.
                </li>
                <li>
                  <strong>A:</strong> Set of all available actions.
                </li>
                <li>
                  <strong>P(s&apos;|s, a):</strong> Transition probability from
                  state s to s&apos; given action a.
                </li>
                <li>
                  <strong>R(s, a, s&apos;):</strong> Reward received after
                  taking action a in s and reaching s&apos;.
                </li>
                <li>
                  <strong>γ ∈ [0, 1):</strong> Discount factor for future
                  rewards.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Concept 2: Bellman Equations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                2. Bellman Equations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                The cornerstone of RL is expressing the value of a state
                recursively in terms of future states:
              </p>
              <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground space-y-1">
                <div>V*(s) = max_a Σ P(s&apos;|s, a) [R + γ V*(s&apos;)]</div>
                <div>
                  Q*(s, a) = Σ P(s&apos;|s, a) [R + γ max_a&apos; Q*(s&apos;,
                  a&apos;)]
                </div>
              </div>
              <p>
                Dynamic programming solves these equations directly, while
                Temporal Difference methods update iteratively from sampled
                transitions.
              </p>
            </CardContent>
          </Card>

          {/* Concept 3: Q-Learning vs SARSA */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                3. Q-Learning vs. SARSA
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Both are model-free TD control methods with different backup
                targets:
              </p>
              <div className="space-y-1.5">
                <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
                  <strong>Q-Learning (Off-Policy):</strong>
                  <div>
                    Q(s, a) ← Q(s, a) + α [R + γ max_a&apos; Q(s&apos;, a&apos;)
                    - Q(s, a)]
                  </div>
                </div>
                <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
                  <strong>SARSA (On-Policy):</strong>
                  <div>
                    Q(s, a) ← Q(s, a) + α [R + γ Q(s&apos;, a&apos;) - Q(s, a)]
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Concept 4: Bandits & Exploration */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                4. Multi-Armed Bandits &amp; UCB
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                In non-associative learning, selecting the optimal arm requires
                balancing sample averages with uncertainty:
              </p>
              <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground">
                A_t = argmax_a [ Q_t(a) + c √(ln t / N_t(a)) ]
              </div>
              <p>
                Arms with few pulls N(a) receive an exploration bonus, ensuring
                all arms are explored sufficiently while exploiting the best
                known.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Self-Check Quiz */}
        <Card className="border-primary/30">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Undergraduate Mastery Quiz
            </CardTitle>
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
      </div>
    </PageLayout>
  );
}
