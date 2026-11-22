import {
  type Action,
  type RLEnvironmentRules,
  type StateValueTable,
  type StatePolicyTable,
  ACTION_DELTAS,
  ACTION_NAMES,
} from "./types";
import { stateKey } from "./rlEngine";

export type DPStateInspection = {
  state: [number, number];
  currentV: number;
  bestAction: Action;
  actionValues: Record<
    Action,
    {
      expectedValue: number;
      transitions: {
        nextState: [number, number];
        prob: number;
        reward: number;
        nextV: number;
      }[];
    }
  >;
  formula: string;
};

export class DPEngine {
  rules: RLEnvironmentRules;
  gamma: number;
  theta: number;
  startPos: [number, number];
  goalPos: [number, number];
  hazards: Set<string>;
  obstacles: Set<string>;
  muds: Set<string>;

  values: StateValueTable = {};
  policy: StatePolicyTable = {};
  sweepCount: number = 0;
  maxDelta: number = 0;
  isConverged: boolean = false;

  get numRows(): number {
    return this.rules.gridHeight ?? this.rules.gridSize;
  }

  get numCols(): number {
    return this.rules.gridWidth ?? this.rules.gridSize;
  }

  constructor(
    rules: RLEnvironmentRules,
    gamma: number = 0.95,
    theta: number = 1e-4,
    startPos: [number, number] = [0, 0],
    goalPos?: [number, number],
    hazards: [number, number][] = [],
    obstacles: [number, number][] = [],
    muds: [number, number][] = [],
  ) {
    this.rules = rules;
    this.gamma = gamma;
    this.theta = theta;
    this.startPos = startPos;
    const defaultGoalR = (rules.gridHeight ?? rules.gridSize) - 1;
    const defaultGoalC = (rules.gridWidth ?? rules.gridSize) - 1;
    this.goalPos = goalPos || [defaultGoalR, defaultGoalC];
    this.hazards = new Set(hazards.map(([r, c]) => stateKey(r, c)));
    this.obstacles = new Set(obstacles.map(([r, c]) => stateKey(r, c)));
    this.muds = new Set(muds.map(([r, c]) => stateKey(r, c)));
    this.reset();
  }

  reset(): void {
    this.values = {};
    this.policy = {};
    this.sweepCount = 0;
    this.maxDelta = 0;
    this.isConverged = false;

    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const key = stateKey(r, c);
        this.values[key] = 0;
        this.policy[key] = 0; // default Up
      }
    }
  }

  getTransitions(
    r: number,
    c: number,
    action: Action,
  ): {
    nextState: [number, number];
    prob: number;
    reward: number;
    isTerminal: boolean;
  }[] {
    const pSlip = this.rules.slipProbability;
    const transitions: {
      nextState: [number, number];
      prob: number;
      reward: number;
      isTerminal: boolean;
    }[] = [];

    const outcomes: { act: Action; prob: number }[] = [];
    if (pSlip > 0) {
      outcomes.push({ act: action, prob: 1 - pSlip });
      outcomes.push({ act: ((action + 1) % 4) as Action, prob: pSlip / 2 });
      outcomes.push({ act: ((action + 3) % 4) as Action, prob: pSlip / 2 });
    } else {
      outcomes.push({ act: action, prob: 1.0 });
    }

    for (const out of outcomes) {
      const [dr, dc] = ACTION_DELTAS[out.act];
      let nr = Math.max(0, Math.min(this.numRows - 1, r + dr));
      let nc = Math.max(0, Math.min(this.numCols - 1, c + dc));

      const nextKey = stateKey(nr, nc);
      if (this.obstacles.has(nextKey)) {
        nr = r;
        nc = c;
      }

      let reward = this.rules.stepReward;
      let isTerminal = false;

      if (nr === this.goalPos[0] && nc === this.goalPos[1]) {
        reward = this.rules.goalReward;
        isTerminal = true;
      } else if (this.hazards.has(stateKey(nr, nc))) {
        reward = this.rules.hazardPenalty;
        if (this.rules.hazardIsTerminal) isTerminal = true;
      } else if (this.muds.has(stateKey(nr, nc))) {
        reward = this.rules.mudPenalty ?? -2;
      }

      transitions.push({
        nextState: [nr, nc],
        prob: out.prob,
        reward,
        isTerminal,
      });
    }

    return transitions;
  }

  stepValueIteration(): { delta: number; converged: boolean } {
    let delta = 0;
    const newValues: StateValueTable = { ...this.values };
    const newPolicy: StatePolicyTable = { ...this.policy };

    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const key = stateKey(r, c);
        if (r === this.goalPos[0] && c === this.goalPos[1]) {
          newValues[key] = 0;
          continue;
        }
        if (this.obstacles.has(key)) continue;
        if (this.hazards.has(key)) {
          newValues[key] = 0;
          continue;
        }

        let maxExpected = -Infinity;
        let bestAction: Action = 0;

        for (let a = 0; a < 4; a++) {
          const act = a as Action;
          const transitions = this.getTransitions(r, c, act);
          let expected = 0;
          for (const t of transitions) {
            const nextKey = stateKey(t.nextState[0], t.nextState[1]);
            const nextV = t.isTerminal ? 0 : this.values[nextKey] || 0;
            expected += t.prob * (t.reward + this.gamma * nextV);
          }

          if (expected > maxExpected) {
            maxExpected = expected;
            bestAction = act;
          }
        }

        const oldV = this.values[key] || 0;
        const diff = Math.abs(oldV - maxExpected);
        if (diff > delta) delta = diff;

        newValues[key] = maxExpected;
        newPolicy[key] = bestAction;
      }
    }

    this.values = newValues;
    this.policy = newPolicy;
    this.sweepCount++;
    this.maxDelta = delta;
    this.isConverged = delta < this.theta;

    return { delta, converged: this.isConverged };
  }

  evaluatePolicySweep(): number {
    let delta = 0;
    const newValues: StateValueTable = { ...this.values };
    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const key = stateKey(r, c);
        if (r === this.goalPos[0] && c === this.goalPos[1]) {
          newValues[key] = 0;
          continue;
        }
        if (this.obstacles.has(key)) continue;
        if (this.hazards.has(key)) {
          newValues[key] = 0;
          continue;
        }

        const currentAct = this.policy[key] ?? 0;
        const transitions = this.getTransitions(r, c, currentAct);
        let expected = 0;
        for (const t of transitions) {
          const nextKey = stateKey(t.nextState[0], t.nextState[1]);
          const nextV = t.isTerminal ? 0 : this.values[nextKey] || 0;
          expected += t.prob * (t.reward + this.gamma * nextV);
        }

        const oldV = this.values[key] || 0;
        const diff = Math.abs(oldV - expected);
        if (diff > delta) delta = diff;
        newValues[key] = expected;
      }
    }
    this.values = newValues;
    return delta;
  }

  evaluatePolicy(maxSweeps: number = 300): number {
    let sweeps = 0;
    while (sweeps < maxSweeps) {
      const delta = this.evaluatePolicySweep();
      sweeps++;
      if (delta < this.theta) break;
    }
    return sweeps;
  }

  improvePolicy(): { policyStable: boolean; changes: number } {
    let policyStable = true;
    let changes = 0;
    const newPolicy: StatePolicyTable = { ...this.policy };

    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const key = stateKey(r, c);
        if (r === this.goalPos[0] && c === this.goalPos[1]) continue;
        if (this.obstacles.has(key)) continue;
        if (this.hazards.has(key)) continue;

        const oldAct = this.policy[key] ?? 0;
        let maxExpected = -Infinity;
        let bestAction: Action = oldAct;

        for (let a = 0; a < 4; a++) {
          const act = a as Action;
          const transitions = this.getTransitions(r, c, act);
          let expected = 0;
          for (const t of transitions) {
            const nextKey = stateKey(t.nextState[0], t.nextState[1]);
            const nextV = t.isTerminal ? 0 : this.values[nextKey] || 0;
            expected += t.prob * (t.reward + this.gamma * nextV);
          }
          if (expected > maxExpected) {
            maxExpected = expected;
            bestAction = act;
          }
        }

        if (bestAction !== oldAct) {
          policyStable = false;
          changes++;
        }
        newPolicy[key] = bestAction;
      }
    }

    this.policy = newPolicy;
    return { policyStable, changes };
  }

  stepPolicyIteration(): { changes: number; converged: boolean } {
    this.evaluatePolicy();
    const { policyStable, changes } = this.improvePolicy();
    this.sweepCount++;
    this.isConverged = policyStable;
    return { changes, converged: policyStable };
  }

  runPolicyIteration(maxIters: number = 30): number {
    let count = 0;
    while (!this.isConverged && count < maxIters) {
      this.stepPolicyIteration();
      count++;
    }
    return count;
  }

  runUntilConvergence(maxSweeps: number = 500): number {
    let count = 0;
    while (!this.isConverged && count < maxSweeps) {
      this.stepValueIteration();
      count++;
    }
    return count;
  }

  inspectState(r: number, c: number): DPStateInspection {
    const key = stateKey(r, c);
    const currentV = this.values[key] || 0;
    const bestAction = this.policy[key] ?? 0;
    const isGoal = r === this.goalPos[0] && c === this.goalPos[1];
    const isObstacle = this.obstacles.has(key);
    const isHazard = this.hazards.has(key);
    const isTerminal = isGoal || isObstacle || isHazard;

    const actionValues: DPStateInspection["actionValues"] = {
      0: { expectedValue: 0, transitions: [] },
      1: { expectedValue: 0, transitions: [] },
      2: { expectedValue: 0, transitions: [] },
      3: { expectedValue: 0, transitions: [] },
    };

    if (!isTerminal) {
      for (let a = 0; a < 4; a++) {
        const act = a as Action;
        const transitions = this.getTransitions(r, c, act);
        let expected = 0;
        const transDetails = [];

        for (const t of transitions) {
          const nextKey = stateKey(t.nextState[0], t.nextState[1]);
          const nextV = t.isTerminal ? 0 : this.values[nextKey] || 0;
          expected += t.prob * (t.reward + this.gamma * nextV);
          transDetails.push({
            nextState: t.nextState,
            prob: t.prob,
            reward: t.reward,
            nextV,
          });
        }

        actionValues[act] = {
          expectedValue: expected,
          transitions: transDetails,
        };
      }
    }

    const maxQ = Math.max(
      ...Object.values(actionValues).map((v) => v.expectedValue),
    );

    let formula = this.isConverged
      ? `V*(${r},${c}) = max_a Q(${r},${c}, a) = ${currentV.toFixed(3)} (optimal: ${ACTION_NAMES[bestAction]})`
      : `Current V(${r},${c}) = ${currentV.toFixed(3)} | Lookahead max_a Q(${r},${c}, a) = ${maxQ.toFixed(3)} (best: ${ACTION_NAMES[bestAction]})`;

    if (isGoal) {
      formula = `Terminal Goal (${r},${c}): Target reached with reward +${this.rules.goalReward}, V(s) = 0.000`;
    } else if (isObstacle) {
      formula = `Obstacle Cell (${r},${c}): Impassable barrier, V(s) = 0.000`;
    } else if (isHazard) {
      formula = `Hazard Pit (${r},${c}): Terminal absorbing state with penalty ${this.rules.hazardPenalty}, V(s) = 0.000`;
    }

    return {
      state: [r, c],
      currentV,
      bestAction,
      actionValues,
      formula,
    };
  }
}
