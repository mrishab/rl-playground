import type { ControllerMode, GameHyperparameters, PongState } from "./types";

export class PongEngine {
  width = 240;
  height = 160;
  paddleH = 34;
  paddleW = 6;
  paddleSpeed = 4.0;
  aiSpeed = 3.0;

  state: PongState;
  qTable: Map<string, [number, number, number]> = new Map();
  hyperparams: GameHyperparameters;
  controller: ControllerMode = "rl";

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.2,
      discountFactor: 0.95,
      explorationRate: 0.1,
      epsilonDecay: 0.998,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  createInitialState(): PongState {
    const startVx = Math.random() > 0.5 ? 3.2 : -3.2;
    const startVy = (Math.random() * 2 - 1) * 2.2;
    return {
      ballX: this.width / 2,
      ballY: this.height / 2,
      ballVx: startVx,
      ballVy: Math.abs(startVy) < 0.5 ? 1.5 : startVy,
      agentY: this.height / 2 - this.paddleH / 2,
      opponentY: this.height / 2 - this.paddleH / 2,
      agentScore: 0,
      opponentScore: 0,
      rallyLength: 0,
      maxRally: 0,
      lastReward: 0,
      isOver: false,
    };
  }

  setController(controller: ControllerMode): void {
    this.controller = controller;
  }

  resetEpisode(): void {
    const agentScore = this.state.agentScore;
    const oppScore = this.state.opponentScore;
    const maxRally = this.state.maxRally;

    const startVx = Math.random() > 0.5 ? 3.2 : -3.2;
    const startVy = (Math.random() * 2 - 1) * 2.2;

    this.state = {
      ...this.createInitialState(),
      ballVx: startVx,
      ballVy: Math.abs(startVy) < 0.5 ? 1.5 : startVy,
      agentScore,
      opponentScore: oppScore,
      maxRally,
    };
  }

  resetAll(): void {
    const prevController = this.controller;
    this.qTable.clear();
    this.state = this.createInitialState();
    this.controller = prevController;
  }

  getStateKey(state: PongState): string {
    const { ballX, ballY, ballVx, ballVy, agentY } = state;
    const dy = ballY - (agentY + this.paddleH / 2);

    let relY = 2; // centered
    if (dy < -25) relY = 0;
    else if (dy < -6) relY = 1;
    else if (dy > 25) relY = 4;
    else if (dy > 6) relY = 3;

    const distX = ballX < 80 ? 0 : ballX < 160 ? 1 : 2;
    const vxDir = ballVx > 0 ? 1 : 0;
    const vyDir = ballVy >= 0 ? 1 : 0;

    return `${relY}_${distX}_${vxDir}_${vyDir}`;
  }

  getQValues(stateKey: string): [number, number, number] {
    let q = this.qTable.get(stateKey);
    if (!q) {
      q = [0, 0, 0];
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  selectAction(stateKey: string, explore = true): number {
    if (this.controller === "search") {
      const s = this.state;
      const dy = s.ballY - (s.agentY + this.paddleH / 2);
      if (dy < -4) return 1; // Move up
      if (dy > 4) return 2; // Move down
      return 0; // Stay
    }

    const q = this.getQValues(stateKey);
    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return Math.floor(Math.random() * 3);
    }
    let maxVal = -Infinity;
    const bestActions: number[] = [];
    for (let a = 0; a < 3; a++) {
      if (q[a] > maxVal) {
        maxVal = q[a];
        bestActions.length = 0;
        bestActions.push(a);
      } else if (q[a] === maxVal) {
        bestActions.push(a);
      }
    }
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  }

  step(actionOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    const stateKey = this.getStateKey(s);
    const action = actionOverride ?? this.selectAction(stateKey, true);

    // Update Agent paddle (Right: x = width - 12)
    if (action === 1) {
      s.agentY = Math.max(0, s.agentY - this.paddleSpeed);
    } else if (action === 2) {
      s.agentY = Math.min(
        this.height - this.paddleH,
        s.agentY + this.paddleSpeed,
      );
    }

    // Update Opponent paddle (Left: x = 6) - reactive AI
    const oppCenter = s.opponentY + this.paddleH / 2;
    if (s.ballVx < 0) {
      if (s.ballY < oppCenter - 4) {
        s.opponentY = Math.max(0, s.opponentY - this.aiSpeed);
      } else if (s.ballY > oppCenter + 4) {
        s.opponentY = Math.min(
          this.height - this.paddleH,
          s.opponentY + this.aiSpeed,
        );
      }
    }

    // Move Ball
    s.ballX += s.ballVx;
    s.ballY += s.ballVy;

    // Bounce on top / bottom walls
    const radius = 3.5;
    if (s.ballY <= radius) {
      s.ballY = radius;
      s.ballVy = Math.abs(s.ballVy);
    } else if (s.ballY >= this.height - radius) {
      s.ballY = this.height - radius;
      s.ballVy = -Math.abs(s.ballVy);
    }

    let reward = 0.05; // Survival step bonus
    let done = false;

    // Hit Right Paddle (Agent)
    const agentX = this.width - 12;
    if (
      s.ballVx > 0 &&
      s.ballX + radius >= agentX &&
      s.ballX - radius <= agentX + this.paddleW &&
      s.ballY >= s.agentY - 2 &&
      s.ballY <= s.agentY + this.paddleH + 2
    ) {
      s.ballVx = -Math.abs(s.ballVx) * 1.03;
      // Add spin based on paddle contact
      const offset =
        (s.ballY - (s.agentY + this.paddleH / 2)) / (this.paddleH / 2);
      s.ballVy += offset * 1.2;
      s.rallyLength += 1;
      if (s.rallyLength > s.maxRally) s.maxRally = s.rallyLength;
      reward += 15.0; // Successful return
    }

    // Hit Left Paddle (Opponent)
    const oppX = 6;
    if (
      s.ballVx < 0 &&
      s.ballX - radius <= oppX + this.paddleW &&
      s.ballX + radius >= oppX &&
      s.ballY >= s.opponentY - 2 &&
      s.ballY <= s.opponentY + this.paddleH + 2
    ) {
      s.ballVx = Math.abs(s.ballVx) * 1.03;
      s.rallyLength += 1;
      if (s.rallyLength > s.maxRally) s.maxRally = s.rallyLength;
    }

    // Out of bounds detection
    if (s.ballX >= this.width) {
      // Missed by agent
      s.opponentScore += 1;
      s.isOver = true;
      reward = -25.0;
      done = true;
    } else if (s.ballX <= 0) {
      // Point scored by agent!
      s.agentScore += 1;
      s.isOver = true;
      reward = 30.0;
      done = true;
    }

    s.lastReward = reward;

    if (this.controller === "rl") {
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
    }

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    avgReward: number;
    avgRally: number;
  } {
    let wins = 0;
    let totalReward = 0;
    let totalRallies = 0;

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let epReward = 0;
      let steps = 0;

      while (!this.state.isOver && steps < 1200) {
        const { reward, done } = this.step();
        epReward += reward;
        steps++;
        if (done) break;
      }

      if (this.state.ballX <= 0) {
        wins++;
      }
      totalRallies += this.state.rallyLength;
      totalReward += epReward;

      // Decay epsilon slightly
      this.hyperparams.explorationRate = Math.max(
        0.02,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    return {
      episodes,
      wins,
      avgReward: totalReward / episodes,
      avgRally: totalRallies / episodes,
    };
  }
}
