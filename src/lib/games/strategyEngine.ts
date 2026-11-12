import type {
  GameHyperparameters,
  StrategyState,
  StrategyUnit,
  TacticalNode,
} from "./types";

export const STRATEGY_GRID_SIZE = 6;

export const DEFAULT_STRATEGY_OBSTACLES: [number, number][] = [
  [1, 2],
  [2, 4],
  [4, 1],
  [3, 3],
];

export const DEFAULT_TACTICAL_NODES: {
  id: string;
  row: number;
  col: number;
}[] = [
  { id: "node-alpha", row: 1, col: 4 },
  { id: "node-bravo", row: 3, col: 1 },
  { id: "node-charlie", row: 4, col: 4 },
];

export class StrategyEngine {
  gridSize = STRATEGY_GRID_SIZE;
  obstacles = DEFAULT_STRATEGY_OBSTACLES;
  state: StrategyState;
  qTable: Map<string, number[]> = new Map();
  hyperparams: GameHyperparameters;

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.2,
      discountFactor: 0.95,
      explorationRate: 0.15,
      epsilonDecay: 0.996,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  createInitialState(): StrategyState {
    const nodes: TacticalNode[] = DEFAULT_TACTICAL_NODES.map((n) => ({
      id: n.id,
      row: n.row,
      col: n.col,
      owner: "neutral",
    }));

    const agent: StrategyUnit = {
      row: 5,
      col: 0,
      health: 100,
      maxHealth: 100,
    };

    const opponent: StrategyUnit = {
      row: 0,
      col: 5,
      health: 100,
      maxHealth: 100,
    };

    return {
      agent,
      opponent,
      nodes,
      obstacles: [...this.obstacles],
      turn: 0,
      score: 0,
      isOver: false,
      winner: null,
      lastReward: 0,
      lastActionDesc: "Battle begins",
    };
  }

  resetEpisode(): void {
    const prevScore = this.state.score;
    this.state = this.createInitialState();
    this.state.score = prevScore;
  }

  resetAll(): void {
    this.qTable.clear();
    this.state = this.createInitialState();
  }

  isObstacle(r: number, c: number): boolean {
    return this.obstacles.some(([or, oc]) => or === r && oc === c);
  }

  getStateKey(state: StrategyState): string {
    const { agent, opponent, nodes } = state;

    // Relative direction and distance to opponent
    const drOpp = Math.sign(opponent.row - agent.row);
    const dcOpp = Math.sign(opponent.col - agent.col);
    const distOpp =
      Math.abs(opponent.row - agent.row) + Math.abs(opponent.col - agent.col);
    const distOppBin = distOpp <= 1 ? 0 : distOpp <= 3 ? 1 : 2;

    // Find nearest non-agent node
    let nearestDist = 999;
    let drNode = 0;
    let dcNode = 0;
    let agentControlled = 0;

    for (const node of nodes) {
      if (node.owner === "agent") {
        agentControlled++;
        continue;
      }
      const d = Math.abs(node.row - agent.row) + Math.abs(node.col - agent.col);
      if (d < nearestDist) {
        nearestDist = d;
        drNode = Math.sign(node.row - agent.row);
        dcNode = Math.sign(node.col - agent.col);
      }
    }

    const hpAdvantage =
      agent.health > opponent.health
        ? 2
        : agent.health === opponent.health
          ? 1
          : 0;

    return `${agent.row}_${agent.col}_${drOpp}_${dcOpp}_${distOppBin}_${drNode}_${dcNode}_${agentControlled}_${hpAdvantage}`;
  }

  getQValues(stateKey: string): number[] {
    let q = this.qTable.get(stateKey);
    if (!q) {
      // 6 actions: 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT, 4=CAPTURE, 5=ATTACK
      q = [0, 0, 0, 0, 0, 0];
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  selectAction(stateKey: string, explore = true): number {
    const q = this.getQValues(stateKey);
    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return Math.floor(Math.random() * 6);
    }
    let best = 0;
    let maxVal = q[0];
    for (let a = 1; a < 6; a++) {
      if (q[a] > maxVal) {
        maxVal = q[a];
        best = a;
      }
    }
    return best;
  }

  executeOpponentAI(): void {
    const { agent, opponent, nodes } = this.state;
    if (opponent.health <= 0) return;

    const distToAgent =
      Math.abs(agent.row - opponent.row) + Math.abs(agent.col - opponent.col);

    // If adjacent to agent, strong attack probability
    if (distToAgent <= 1) {
      agent.health = Math.max(0, agent.health - 30);
      return;
    }

    // Check if on a node that opponent doesn't own
    const currentNode = nodes.find(
      (n) => n.row === opponent.row && n.col === opponent.col,
    );
    if (currentNode && currentNode.owner !== "opponent") {
      currentNode.owner = "opponent";
      return;
    }

    // Otherwise move towards closest neutral or agent node
    let target = { row: agent.row, col: agent.col };
    let bestDist = 999;
    for (const n of nodes) {
      if (n.owner !== "opponent") {
        const d =
          Math.abs(n.row - opponent.row) + Math.abs(n.col - opponent.col);
        if (d < bestDist) {
          bestDist = d;
          target = { row: n.row, col: n.col };
        }
      }
    }

    const deltas = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];

    let bestMove = [opponent.row, opponent.col];
    let bestMoveDist = 999;

    for (const [dr, dc] of deltas) {
      const nr = opponent.row + dr;
      const nc = opponent.col + dc;
      if (
        nr >= 0 &&
        nr < this.gridSize &&
        nc >= 0 &&
        nc < this.gridSize &&
        !this.isObstacle(nr, nc) &&
        !(nr === agent.row && nc === agent.col)
      ) {
        const d = Math.abs(nr - target.row) + Math.abs(nc - target.col);
        if (d < bestMoveDist) {
          bestMoveDist = d;
          bestMove = [nr, nc];
        }
      }
    }

    opponent.row = bestMove[0];
    opponent.col = bestMove[1];
  }

  step(actionOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    s.turn += 1;
    const stateKey = this.getStateKey(s);
    const action = actionOverride ?? this.selectAction(stateKey, true);

    let reward = -0.05; // tiny action cost
    let done = false;
    let desc = "Move";

    const moveDeltas = [
      [-1, 0], // 0: UP
      [0, 1], // 1: RIGHT
      [1, 0], // 2: DOWN
      [0, -1], // 3: LEFT
    ];

    if (action >= 0 && action <= 3) {
      const [dr, dc] = moveDeltas[action];
      const nr = s.agent.row + dr;
      const nc = s.agent.col + dc;

      if (
        nr >= 0 &&
        nr < this.gridSize &&
        nc >= 0 &&
        nc < this.gridSize &&
        !this.isObstacle(nr, nc) &&
        !(nr === s.opponent.row && nc === s.opponent.col)
      ) {
        s.agent.row = nr;
        s.agent.col = nc;
        desc = `Move to (${nr}, ${nc})`;
      } else {
        reward -= 0.6; // bump penalty
        desc = "Move blocked";
      }
    } else if (action === 4) {
      // CAPTURE NODE
      const node = s.nodes.find(
        (n) => n.row === s.agent.row && n.col === s.agent.col,
      );
      if (node && node.owner !== "agent") {
        node.owner = "agent";
        reward += 12.0;
        s.score += 25;
        desc = `Captured ${node.id}`;
      } else {
        reward -= 0.4;
        desc = "No uncaptured node";
      }
    } else if (action === 5) {
      // ATTACK
      const dist =
        Math.abs(s.agent.row - s.opponent.row) +
        Math.abs(s.agent.col - s.opponent.col);
      if (dist <= 1) {
        s.opponent.health = Math.max(0, s.opponent.health - 35);
        reward += 22.0;
        s.score += 30;
        desc = `Attacked opponent (-35 HP)`;
        if (s.opponent.health <= 0) {
          s.isOver = true;
          s.winner = "agent";
          reward += 60.0;
          s.score += 150;
          desc = "Opponent destroyed! Victory!";
          done = true;
        }
      } else {
        reward -= 0.5;
        desc = "Attack missed (out of range)";
      }
    }

    // Opponent counter-action if game not over
    if (!done) {
      const prevAgentHp = s.agent.health;
      this.executeOpponentAI();
      if (s.agent.health < prevAgentHp) {
        reward -= 20.0;
        desc += " | Took damage from enemy!";
        if (s.agent.health <= 0) {
          s.isOver = true;
          s.winner = "opponent";
          reward -= 45.0;
          desc = "Agent destroyed! Defeat!";
          done = true;
        }
      }
    }

    // Node holding passive points
    for (const node of s.nodes) {
      if (node.owner === "agent") {
        s.score += 1;
        reward += 0.5;
      }
    }

    // Max turns limit
    if (s.turn >= 60 && !done) {
      s.isOver = true;
      const agentNodes = s.nodes.filter((n) => n.owner === "agent").length;
      const oppNodes = s.nodes.filter((n) => n.owner === "opponent").length;

      if (
        agentNodes > oppNodes ||
        (agentNodes === oppNodes && s.agent.health > s.opponent.health)
      ) {
        s.winner = "agent";
        reward += 25.0;
      } else if (oppNodes > agentNodes) {
        s.winner = "opponent";
        reward -= 25.0;
      } else {
        s.winner = "draw";
      }
      desc = `Time out - ${s.winner}`;
      done = true;
    }

    s.lastReward = reward;
    s.lastActionDesc = desc;

    // RL Q-update
    const nextStateKey = this.getStateKey(s);
    const qCurrent = this.getQValues(stateKey);
    const nextQ = this.getQValues(nextStateKey);

    const target = done
      ? reward
      : reward +
        this.hyperparams.discountFactor *
          (this.hyperparams.algorithm === "sarsa"
            ? nextQ[this.selectAction(nextStateKey, true)]
            : Math.max(...nextQ));

    qCurrent[action] +=
      this.hyperparams.learningRate * (target - qCurrent[action]);

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    losses: number;
    draws: number;
    avgReward: number;
  } {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalReward = 0;

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let epReward = 0;

      while (!this.state.isOver) {
        const { reward, done } = this.step();
        epReward += reward;
        if (done) break;
      }

      if (this.state.winner === "agent") wins++;
      else if (this.state.winner === "opponent") losses++;
      else draws++;

      totalReward += epReward;

      this.hyperparams.explorationRate = Math.max(
        0.03,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    return {
      episodes,
      wins,
      losses,
      draws,
      avgReward: totalReward / episodes,
    };
  }
}
