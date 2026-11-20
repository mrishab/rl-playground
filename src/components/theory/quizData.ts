export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "How do Q-Learning and SARSA differ in updates?",
    options: [
      "SARSA cannot run on episodic tasks.",
      "Q-learning is model-based, while SARSA is model-free.",
      "Q-learning targets max_a' Q(s',a'); SARSA targets chosen a'.",
      "Q-learning requires deterministic transitions.",
    ],
    correctIndex: 2,
    explanation:
      "Q-learning is off-policy using max target; SARSA is on-policy using the taken action.",
  },
  {
    id: 2,
    question: "Why does SARSA take a safer route in Cliff Walking?",
    options: [
      "SARSA accounts for epsilon exploration mistakes near cliffs.",
      "SARSA uses a smaller learning rate.",
      "Q-learning fails on negative penalties.",
      "SARSA disables exploration completely.",
    ],
    correctIndex: 0,
    explanation:
      "SARSA learns safer paths because it accounts for random exploratory falls.",
  },
  {
    id: 3,
    question: "How does Double Q-Learning fix maximization bias?",
    options: [
      "It removes bounds on environmental rewards.",
      "It trains two agents on separate grids.",
      "It raises discount factors above 1.0.",
      "It decouples action selection and evaluation with two tables.",
    ],
    correctIndex: 3,
    explanation:
      "Using two tables stops maximization over noisy estimates from overestimating values.",
  },
  {
    id: 4,
    question: "What core mechanism powers Upper Confidence Bound?",
    options: [
      "Greedy selection of highest sample mean.",
      "Uncertainty bonuses that shrink as arm pulls increase.",
      "Equal exploration chances across all arms.",
      "Periodic random resets of value estimates.",
    ],
    correctIndex: 1,
    explanation:
      "UCB adds an uncertainty bonus to explore under-sampled arms with high potential.",
  },
  {
    id: 5,
    question: "What does Dynamic Programming require over Q-Learning?",
    options: [
      "Continuous state and action spaces.",
      "A deep neural network approximator.",
      "Complete transition probabilities and reward models.",
      "An epsilon-greedy decay schedule.",
    ],
    correctIndex: 2,
    explanation:
      "Dynamic Programming requires complete transition models; Q-learning learns from samples.",
  },
];
