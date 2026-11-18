# RL Playground 🎮🤖

An extensive, interactive Reinforcement Learning laboratory for undergraduate students and researchers to explore fundamentals and core algorithms of Reinforcement Learning in the browser.

Live application: **[https://mrishab.github.io/rl-playground/](https://mrishab.github.io/rl-playground/)**

## ✨ Core Modules & Learning Labs

### 1. GridWorld Laboratory (`/gridworld`)

- **Algorithms Supported:**
  - **Q-Learning** (Off-policy TD control)
  - **SARSA** (On-policy TD control)
  - **Expected SARSA** (Expectation backup over policy distribution)
  - **Double Q-Learning** (Mitigates maximization overestimation bias)
  - **Monte Carlo Control** (First-visit episodic returns)
  - **Value Iteration** (Dynamic programming Bellman optimality backup)
- **Classic Sutton & Barto Presets:**
  - _Cliff Walking (Example 6.6):_ Visual demonstration of SARSA choosing the safe path while Q-Learning cuts close to the cliff edge.
  - _Frozen Lake:_ Slippery stochastic ice transitions with slip probability $P(\text{slip})$.
  - _Sutton-Barto Gridworld:_ Teleports, mud penalties, and hazards.
  - _Dynamic Predators:_ Smart obstacles with Patrol, Chase, Ambush, Guard, and Random strategies.
  - _Maze Runner:_ Deep dead ends requiring exploration.
- **Interactive Visual Overlays:**
  - Value Function Heatmap ($V^*(s)$)
  - Derived Policy Vectors ($\pi^*(s)$)
  - 4-Quadrant Q-Rose (Up, Down, Left, Right Q-values per cell)
  - State Visitation Frequency Heatmap
  - Live Mathematical Bellman Inspector with numerical formula substitution.

### 2. Multi-Armed Bandits Lab (`/bandits`)

- **10-Armed Gaussian Bandit Testbed** (Sutton & Barto Chapter 2).
- Compare exploration vs exploitation strategies:
  - $\epsilon$-Greedy ($\epsilon = 0, 0.01, 0.1$)
  - Upper Confidence Bound (UCB1: $c=2$)
  - Optimistic Initial Values ($Q_0 = 5.0$)
  - Thompson Sampling (Bayesian sampling)
- Stationary and Non-Stationary (random-walk drift) modes.
- Real-time plots: Average Reward vs. Steps, % Optimal Action Selected, and Arm Pulls distribution.

### 3. Dynamic Programming Lab (`/dp`)

- **Model-Based Planning** (Sutton & Barto Chapter 4).
- Exact Bellman Optimality Backups: $V_{k+1}(s) = \max_a \sum_{s', r} P(s', r | s, a) [r + \gamma V_k(s')]$.
- Step-by-step sweep visualization with maximum change $\Delta = \max_s |V_{k+1}(s) - V_k(s)|$.
- Interactive State Inspector breaking down transition probabilities and expected returns for each action.

### 4. Saved Policies & Agent Management (`/agents`)

- Save trained agent snapshots with hyperparameters, grid layout, and Q-table.
- Export / Import agent policies via JSON.
- Load any saved agent back into the GridWorld lab for live replay.

### 5. Theory & Undergrad Self-Check Quiz (`/theory`)

- Comprehensive mathematical reference covering MDPs, Bellman Equations, and TD learning.
- 5-question interactive conceptual quiz with instant scoring and pedagogical explanations.

### 6. Interactive RL Games & Search vs RL Playground (`/games`)

- **Interactive Comparison Toggle:** Switch seamlessly between "Train with RL" and "Try with A\* / Search" to demonstrate where deterministic search fails and why reinforcement learning is required.
- **The Stochastic Gridworld with Slippery Tiles ("The Ice Maze"):**
  - Real-time wind/slip slider ($P(\text{slip})$ from 0% to 60%).
  - Demonstrates why deterministic $A^*$ search breaks or crashes when slipping into hazard pits, while RL learns safe paths with obstacle buffers.
- **Simplified Multi-Armed Bandit ("The Slot Machine"):**
  - 4 slot machines with distinct unknown probability distributions.
  - Demonstrates why Search/CSPs fail (zero transition states, pure statistical optimization) and how RL balances exploration vs exploitation.
- **Dynamic Inventory Management ("The Lemonade Stand"):**
  - Daily decision making on prep inventory facing weather-dependent stochastic customer demand.
  - Highlights why static CSP planning causes stockouts or ingredient spoilage, and how RL learns state-conditioned inventory balance.
- **Toy Autonomous Car on a Continuous Track:**
  - 2D curved race track with continuous wall distance raycasting sensors.
  - Demonstrates continuous infinite state-action spaces where discrete tree search fails and function approximation (Deep RL / Neural Networks) is required.
- **Classic Games:** Pong, Pac-Man Maze, Grid Chess, and Tactical Grid Strategy.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** + **Radix UI** primitives
- **Zustand** state management
- **Cypress** end-to-end test suite
- **GitHub Actions** deployment to GitHub Pages

## 🧪 Testing

```bash
# Run unit & algorithmic test suites (GridWorld, Bandits, DP)
npm test

# Run type check & production build
npm run build
```
