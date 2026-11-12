export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
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
