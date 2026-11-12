import {
  type Action,
  type RLEnvironmentRules,
  type RLHyperparameters,
  type EpisodeResult,
  type SmartObstacle,
  type TransitionLog,
  ACTION_DELTAS,
  ACTION_NAMES,
} from "./types";
import { stepSmartObstacle } from "./smartObstacleBehavior";

export type QTable = Record<string, [number, number, number, number]>;

export function stateKey(r: number, c: number): string {
  return `${r},${c}`;
}

export function parseStateKey(key: string): [number, number] {
  const parts = key.split(",");
  return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}

export class RLEngine {
  rules: RLEnvironmentRules;
  params: RLHyperparameters;
  startPos: [number, number];
  goalPos: [number, number];
  hazards: Set<string>;
  obstacles: Set<string>;
  muds: Set<string>;
  ices: Set<string>;
  initialSmartObstacles: SmartObstacle[];
  smartObstacles: SmartObstacle[];
  qTable: QTable = {};
  qTable2: QTable = {}; // For Double Q-Learning (QB)
  stateVisits: Record<string, number> = {};
  lastTransition: TransitionLog | null = null;

  get numRows(): number {
    return this.rules.gridHeight ?? this.rules.gridSize;
  }

  get numCols(): number {
    return this.rules.gridWidth ?? this.rules.gridSize;
  }

  constructor(
    rules: RLEnvironmentRules,
    params: RLHyperparameters,
    startPos: [number, number] = [0, 0],
    goalPos?: [number, number],
    hazards: [number, number][] = [],
    obstacles: [number, number][] = [],
    smartObstacles: SmartObstacle[] = [],
    muds: [number, number][] = [],
    ices: [number, number][] = [],
  ) {
    this.rules = rules;
    this.params = params;
    this.startPos = startPos;
    const defaultGoalR = (rules.gridHeight ?? rules.gridSize) - 1;
    const defaultGoalC = (rules.gridWidth ?? rules.gridSize) - 1;
    this.goalPos = goalPos || [defaultGoalR, defaultGoalC];
    this.hazards = new Set(hazards.map(([r, c]) => stateKey(r, c)));
    this.obstacles = new Set(obstacles.map(([r, c]) => stateKey(r, c)));
    this.muds = new Set(muds.map(([r, c]) => stateKey(r, c)));
    this.ices = new Set(ices.map(([r, c]) => stateKey(r, c)));
    this.initialSmartObstacles = smartObstacles.map((o) => ({ ...o }));
    this.smartObstacles = smartObstacles.map((o) => ({ ...o }));
    this.initQTable();
  }

  initQTable(): void {
    this.qTable = {};
    this.qTable2 = {};
    this.stateVisits = {};
    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const key = stateKey(r, c);
        this.qTable[key] = [0, 0, 0, 0];
        this.qTable2[key] = [0, 0, 0, 0];
        this.stateVisits[key] = 0;
      }
    }
  }

  getQValues(r: number, c: number): [number, number, number, number] {
    const key = stateKey(r, c);
    if (!this.qTable[key]) {
      this.qTable[key] = [0, 0, 0, 0];
    }
    return this.qTable[key];
  }

  getCombinedQValues(r: number, c: number): [number, number, number, number] {
    if (this.params.algorithm === "double-q") {
      const q1 = this.getQValues(r, c);
      const key = stateKey(r, c);
      if (!this.qTable2[key]) {
        this.qTable2[key] = [0, 0, 0, 0];
      }
      const q2 = this.qTable2[key];
      return [
        (q1[0] + q2[0]) / 2,
        (q1[1] + q2[1]) / 2,
        (q1[2] + q2[2]) / 2,
        (q1[3] + q2[3]) / 2,
      ];
    }
    return this.getQValues(r, c);
  }

  getStateValue(r: number, c: number): number {
    const q = this.getCombinedQValues(r, c);
    return Math.max(...q);
  }

  getBestAction(r: number, c: number): Action {
    const q = this.getCombinedQValues(r, c);
    let maxQ = -Infinity;
    for (let a = 0; a < 4; a++) {
      if (q[a] > maxQ) {
        maxQ = q[a];
      }
    }
    const candidates: Action[] = [];
    for (let a = 0; a < 4; a++) {
      if (Math.abs(q[a] - maxQ) < 1e-6) {
        candidates.push(a as Action);
      }
    }
    if (candidates.length === 1) return candidates[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  chooseAction(r: number, c: number, epsilonOverride?: number): Action {
    const eps = epsilonOverride ?? this.params.explorationRate;
    if (Math.random() < eps) {
      return Math.floor(Math.random() * 4) as Action;
    }
    return this.getBestAction(r, c);
  }

  step(
    r: number,
    c: number,
    action: Action,
  ): {
    nextPos: [number, number];
    reward: number;
    isTerminal: boolean;
    caughtByObstacle: boolean;
  } {
    let effectiveAction = action;
    const currentKey = stateKey(r, c);
    const isIce = this.ices.has(currentKey);
    const slipProb = isIce
      ? Math.max(0.4, this.rules.slipProbability)
      : this.rules.slipProbability;

    if (Math.random() < slipProb) {
      const slipOffset = Math.random() < 0.5 ? 1 : 3;
      effectiveAction = ((action + slipOffset) % 4) as Action;
    }

    const [dr, dc] = ACTION_DELTAS[effectiveAction];
    let nextR = Math.max(0, Math.min(this.numRows - 1, r + dr));
    let nextC = Math.max(0, Math.min(this.numCols - 1, c + dc));

    const candidateKey = stateKey(nextR, nextC);
    if (this.obstacles.has(candidateKey)) {
      nextR = r;
      nextC = c;
    }

    const penalty = this.rules.smartObstaclePenalty ?? -40;
    const isObstacleTerminal = this.rules.smartObstacleIsTerminal ?? false;

    // Helper to step all smart obstacles with mutual non-overlapping tracking
    const advanceObstacles = (targetAgentPos: [number, number]) => {
      const currentPositions = new Set(
        this.smartObstacles.map((o) => stateKey(o.r, o.c)),
      );
      this.smartObstacles = this.smartObstacles.map((obs) => {
        currentPositions.delete(stateKey(obs.r, obs.c));
        const moved = stepSmartObstacle(
          obs,
          targetAgentPos,
          this.goalPos,
          this.rules.gridSize,
          this.obstacles,
          currentPositions,
        );
        currentPositions.add(stateKey(moved.r, moved.c));
        return moved;
      });
    };

    // Check collision with smart obstacle at its current position
    const hitCurrentObs = this.smartObstacles.some(
      (o) => o.r === nextR && o.c === nextC,
    );
    if (hitCurrentObs) {
      if (isObstacleTerminal) {
        return {
          nextPos: [nextR, nextC],
          reward: penalty,
          isTerminal: true,
          caughtByObstacle: true,
        };
      }
      advanceObstacles([nextR, nextC]);
      return {
        nextPos: [nextR, nextC],
        reward: penalty,
        isTerminal: false,
        caughtByObstacle: true,
      };
    }

    const isGoal = nextR === this.goalPos[0] && nextC === this.goalPos[1];
    if (isGoal) {
      return {
        nextPos: [nextR, nextC],
        reward: this.rules.goalReward,
        isTerminal: true,
        caughtByObstacle: false,
      };
    }

    // Move smart obstacles
    advanceObstacles([nextR, nextC]);

    // Check if smart obstacle moved onto agent
    const caughtAfterMove = this.smartObstacles.some(
      (o) => o.r === nextR && o.c === nextC,
    );
    if (caughtAfterMove) {
      return {
        nextPos: [nextR, nextC],
        reward: penalty,
        isTerminal: isObstacleTerminal,
        caughtByObstacle: true,
      };
    }

    const actualNextKey = stateKey(nextR, nextC);
    const isHazard = this.hazards.has(actualNextKey);
    const isMud = this.muds.has(actualNextKey);

    let reward = this.rules.stepReward;
    let isTerminal = false;

    if (isMud) {
      reward = this.rules.mudPenalty ?? -2;
    }

    if (isHazard) {
      reward = this.rules.hazardPenalty;
      if (this.rules.hazardIsTerminal) {
        isTerminal = true;
      }
    }

    return {
      nextPos: [nextR, nextC],
      reward,
      isTerminal,
      caughtByObstacle: false,
    };
  }

  runEpisode(maxSteps: number = 100): EpisodeResult {
    let currPos = [...this.startPos] as [number, number];
    let totalReward = 0;
    let steps = 0;
    let reachedGoal = false;
    let caughtByObstacle = false;
    let sumTdError = 0;
    let tdCount = 0;

    // Reset smart obstacles to initial positions at start of episode
    this.smartObstacles = this.initialSmartObstacles.map((o) => ({ ...o }));

    if (currPos[0] === this.goalPos[0] && currPos[1] === this.goalPos[1]) {
      return {
        episode: 0,
        totalReward: this.rules.goalReward,
        steps: 0,
        reachedGoal: true,
        caughtByObstacle: false,
        tdError: 0,
      };
    }

    // Dynamic Programming special paths
    if (
      this.params.algorithm === "value-iteration" ||
      this.params.algorithm === "policy-iteration"
    ) {
      this.runDPSweep();
    }

    // Monte Carlo memory: track visited (s, a, r)
    const trajectory: { stateKey: string; action: Action; reward: number }[] =
      [];

    let action = this.chooseAction(currPos[0], currPos[1]);

    while (steps < maxSteps) {
      steps++;
      const [r, c] = currPos;
      const key = stateKey(r, c);
      this.stateVisits[key] = (this.stateVisits[key] || 0) + 1;

      const stepRes = this.step(r, c, action);
      const { nextPos, reward, isTerminal } = stepRes;
      if (stepRes.caughtByObstacle) {
        caughtByObstacle = true;
      }
      totalReward += reward;

      const [nextR, nextC] = nextPos;
      const nextKey = stateKey(nextR, nextC);
      const nextAction = this.chooseAction(nextR, nextC);

      const alpha = this.params.learningRate;
      const gamma = this.params.discountFactor;

      if (this.params.algorithm === "monte-carlo") {
        trajectory.push({ stateKey: key, action, reward });
      } else if (this.params.algorithm === "q-learning") {
        const q = this.getQValues(r, c);
        const qBefore = q[action];
        const nextQ = this.getQValues(nextR, nextC);
        const maxNextQ = isTerminal ? 0 : Math.max(...nextQ);
        const targetQ = reward + gamma * maxNextQ;
        const td = targetQ - qBefore;
        q[action] += alpha * td;
        this.qTable[key] = q;
        sumTdError += Math.abs(td);
        tdCount++;

        this.lastTransition = {
          state: [r, c],
          action,
          reward,
          nextState: [nextR, nextC],
          qBefore,
          qAfter: q[action],
          targetQ,
          formula: `Q(s,${ACTION_NAMES[action]}) ← ${qBefore.toFixed(2)} + ${alpha.toFixed(2)} × [${reward.toFixed(1)} + ${gamma.toFixed(2)} × max(${maxNextQ.toFixed(2)}) - ${qBefore.toFixed(2)}]`,
        };
      } else if (this.params.algorithm === "sarsa") {
        const q = this.getQValues(r, c);
        const qBefore = q[action];
        const nextQ = this.getQValues(nextR, nextC);
        const expectedNext = isTerminal ? 0 : nextQ[nextAction];
        const targetQ = reward + gamma * expectedNext;
        const td = targetQ - qBefore;
        q[action] += alpha * td;
        this.qTable[key] = q;
        sumTdError += Math.abs(td);
        tdCount++;

        this.lastTransition = {
          state: [r, c],
          action,
          reward,
          nextState: [nextR, nextC],
          qBefore,
          qAfter: q[action],
          targetQ,
          formula: `SARSA: Q(s,${ACTION_NAMES[action]}) ← ${qBefore.toFixed(2)} + ${alpha.toFixed(2)} × [${reward.toFixed(1)} + ${gamma.toFixed(2)} × Q(s',${ACTION_NAMES[nextAction]}) - ${qBefore.toFixed(2)}]`,
        };
      } else if (this.params.algorithm === "expected-sarsa") {
        const q = this.getQValues(r, c);
        const qBefore = q[action];
        const nextQ = this.getQValues(nextR, nextC);
        let expectedNext = 0;
        if (!isTerminal) {
          const eps = this.params.explorationRate;
          const bestA = this.getBestAction(nextR, nextC);
          for (let a = 0; a < 4; a++) {
            const prob = a === bestA ? 1 - eps + eps / 4 : eps / 4;
            expectedNext += prob * nextQ[a];
          }
        }
        const targetQ = reward + gamma * expectedNext;
        const td = targetQ - qBefore;
        q[action] += alpha * td;
        this.qTable[key] = q;
        sumTdError += Math.abs(td);
        tdCount++;
      } else if (this.params.algorithm === "double-q") {
        // Double Q-Learning: flip a coin to update QA or QB
        const updateA = Math.random() < 0.5;
        if (updateA) {
          const qA = this.getQValues(r, c);
          const qBefore = qA[action];
          const bestActionInA = this.getBestAction(nextR, nextC);
          const qBNext = this.qTable2[nextKey] || [0, 0, 0, 0];
          const targetQ = isTerminal
            ? reward
            : reward + gamma * qBNext[bestActionInA];
          const td = targetQ - qBefore;
          qA[action] += alpha * td;
          this.qTable[key] = qA;
          sumTdError += Math.abs(td);
          tdCount++;
        } else {
          if (!this.qTable2[key]) this.qTable2[key] = [0, 0, 0, 0];
          const qB = this.qTable2[key];
          const qBefore = qB[action];
          // find best action in QB
          let bestActionInB: Action = 0;
          let maxVal = -Infinity;
          for (let a = 0; a < 4; a++) {
            if (qB[a] > maxVal) {
              maxVal = qB[a];
              bestActionInB = a as Action;
            }
          }
          const qANext = this.getQValues(nextR, nextC);
          const targetQ = isTerminal
            ? reward
            : reward + gamma * qANext[bestActionInB];
          const td = targetQ - qBefore;
          qB[action] += alpha * td;
          this.qTable2[key] = qB;
          sumTdError += Math.abs(td);
          tdCount++;
        }
      }

      if (
        nextR === this.goalPos[0] &&
        nextC === this.goalPos[1] &&
        !stepRes.caughtByObstacle
      ) {
        reachedGoal = true;
      }

      if (isTerminal) break;

      currPos = nextPos;
      action = nextAction;
    }

    // Monte Carlo offline return update
    if (this.params.algorithm === "monte-carlo" && trajectory.length > 0) {
      let G = 0;
      const visited = new Set<string>();
      const gamma = this.params.discountFactor;
      const alpha = this.params.learningRate;

      for (let t = trajectory.length - 1; t >= 0; t--) {
        const stepItem = trajectory[t];
        G = gamma * G + stepItem.reward;
        const saKey = `${stepItem.stateKey}:${stepItem.action}`;
        if (!visited.has(saKey)) {
          visited.add(saKey);
          const q = this.qTable[stepItem.stateKey] || [0, 0, 0, 0];
          q[stepItem.action] += alpha * (G - q[stepItem.action]);
          this.qTable[stepItem.stateKey] = q;
        }
      }
    }

    // Epsilon decay if configured
    if (this.params.epsilonDecay && this.params.explorationRate > (this.params.minEpsilon ?? 0.01)) {
      this.params.explorationRate = Math.max(
        this.params.minEpsilon ?? 0.01,
        this.params.explorationRate * this.params.epsilonDecay,
      );
    }

    return {
      episode: 0,
      totalReward,
      steps,
      reachedGoal,
      caughtByObstacle,
      tdError: tdCount > 0 ? sumTdError / tdCount : 0,
    };
  }

  // Dynamic Programming: Bellman Optimality Backup across all grid cells
  runDPSweep(): { delta: number; converged: boolean } {
    let maxDelta = 0;
    const gamma = this.params.discountFactor;

    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const key = stateKey(r, c);
        if (r === this.goalPos[0] && c === this.goalPos[1]) continue;
        if (this.obstacles.has(key)) continue;

        const currentQ = this.getQValues(r, c);

        for (let a = 0; a < 4; a++) {
          const action = a as Action;
          const [dr, dc] = ACTION_DELTAS[action];
          let nextR = Math.max(0, Math.min(this.numRows - 1, r + dr));
          let nextC = Math.max(0, Math.min(this.numCols - 1, c + dc));
          if (this.obstacles.has(stateKey(nextR, nextC))) {
            nextR = r;
            nextC = c;
          }

          let reward = this.rules.stepReward;
          let isTerminal = false;
          if (nextR === this.goalPos[0] && nextC === this.goalPos[1]) {
            reward = this.rules.goalReward;
            isTerminal = true;
          } else if (this.hazards.has(stateKey(nextR, nextC))) {
            reward = this.rules.hazardPenalty;
            if (this.rules.hazardIsTerminal) isTerminal = true;
          } else if (this.muds.has(stateKey(nextR, nextC))) {
            reward = this.rules.mudPenalty ?? -2;
          }

          const nextQ = this.getQValues(nextR, nextC);
          const maxNext = isTerminal ? 0 : Math.max(...nextQ);
          const backupVal = reward + gamma * maxNext;

          const diff = Math.abs(currentQ[action] - backupVal);
          if (diff > maxDelta) maxDelta = diff;

          currentQ[action] = currentQ[action] + this.params.learningRate * (backupVal - currentQ[action]);
        }

        this.qTable[key] = currentQ;
      }
    }

    return { delta: maxDelta, converged: maxDelta < 0.001 };
  }

  trainBatch(episodes: number, maxSteps: number = 100): EpisodeResult[] {
    const results: EpisodeResult[] = [];
    for (let e = 1; e <= episodes; e++) {
      const res = this.runEpisode(maxSteps);
      res.episode = e;
      results.push(res);
    }
    return results;
  }
}
