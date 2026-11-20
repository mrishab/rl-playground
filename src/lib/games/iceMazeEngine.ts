import type {
  ControllerMode,
  GameHyperparameters,
  IceMazeState,
} from "./types";

export const ICE_MAZE_SIZE = 8;

const DEFAULT_HAZARDS: [number, number][] = [
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
];

const DEFAULT_WALLS: [number, number][] = [
  [0, 3],
  [1, 3],
];

const ACTIONS: [number, number][] = [
  [-1, 0], // 0: Up
  [0, 1], // 1: Right
  [1, 0], // 2: Down
  [0, -1], // 3: Left
];

const ACTION_NAMES = ["North", "East", "South", "West"];

export class IceMazeEngine {
  size = ICE_MAZE_SIZE;
  startPos: [number, number] = [0, 0];
  goalPos: [number, number] = [7, 7];
  hazards: [number, number][] = [...DEFAULT_HAZARDS];
  walls: [number, number][] = [...DEFAULT_WALLS];

  state: IceMazeState;
  qTable: Map<string, [number, number, number, number]> = new Map();
  hyperparams: GameHyperparameters;

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.25,
      discountFactor: 0.95,
      explorationRate: 0.25,
      epsilonDecay: 0.995,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  isWall(r: number, c: number): boolean {
    return this.walls.some(([wr, wc]) => wr === r && wc === c);
  }

  isHazard(r: number, c: number): boolean {
    return this.hazards.some(([hr, hc]) => hr === r && hc === c);
  }

  createInitialState(): IceMazeState {
    const aStarPath = this.computeAStarPath(this.startPos, this.goalPos);
    return {
      agentRow: this.startPos[0],
      agentCol: this.startPos[1],
      goalRow: this.goalPos[0],
      goalCol: this.goalPos[1],
      hazards: [...this.hazards],
      walls: [...this.walls],
      slipRate: 0.3,
      stepCount: 0,
      isOver: false,
      won: false,
      lastReward: 0,
      lastSlip: null,
      aStarPath,
      controller: "rl",
      failedBySlip: false,
      visitedPath: [[this.startPos[0], this.startPos[1]]],
      policyArrows: this.getPolicyMap(),
    };
  }

  getPolicyMap(): Record<string, number> {
    const map: Record<string, number> = {};
    for (const [key, q] of this.qTable.entries()) {
      let maxQ = -Infinity;
      let bestA = 0;
      for (let a = 0; a < 4; a++) {
        if (q[a] > maxQ) {
          maxQ = q[a];
          bestA = a;
        }
      }
      map[key] = bestA;
    }
    return map;
  }

  setSlipRate(slipRate: number): void {
    this.state.slipRate = Math.max(0, Math.min(1.0, slipRate));
  }

  setController(controller: ControllerMode): void {
    this.state.controller = controller;
  }

  resetEpisode(): void {
    const slipRate = this.state.slipRate;
    const controller = this.state.controller;
    const aStarPath = this.computeAStarPath(this.startPos, this.goalPos);
    this.state = {
      ...this.createInitialState(),
      slipRate,
      controller,
      aStarPath,
    };
  }

  resetAll(): void {
    this.qTable.clear();
    const slipRate = this.state.slipRate;
    const controller = this.state.controller;
    this.state = this.createInitialState();
    this.state.slipRate = slipRate;
    this.state.controller = controller;
  }

  getStateKey(r: number, c: number): string {
    return `${r}_${c}`;
  }

  getQValues(stateKey: string): [number, number, number, number] {
    let q = this.qTable.get(stateKey);
    if (!q) {
      q = [0, 0, 0, 0];
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  selectAction(r: number, c: number, explore = true): number {
    const stateKey = this.getStateKey(r, c);
    const q = this.getQValues(stateKey);
    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return Math.floor(Math.random() * 4);
    }
    let maxVal = -Infinity;
    const best: number[] = [];
    for (let a = 0; a < 4; a++) {
      if (q[a] > maxVal) {
        maxVal = q[a];
        best.length = 0;
        best.push(a);
      } else if (q[a] === maxVal) {
        best.push(a);
      }
    }
    return best[Math.floor(Math.random() * best.length)];
  }

  computeAStarPath(
    start: [number, number],
    goal: [number, number],
  ): [number, number][] {
    type Node = {
      r: number;
      c: number;
      g: number;
      h: number;
      f: number;
      parent?: Node;
    };

    const openSet: Node[] = [];
    const closedSet = new Set<string>();

    const h = (r: number, c: number) =>
      Math.abs(r - goal[0]) + Math.abs(c - goal[1]);

    openSet.push({
      r: start[0],
      c: start[1],
      g: 0,
      h: h(start[0], start[1]),
      f: h(start[0], start[1]),
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current.r === goal[0] && current.c === goal[1]) {
        const path: [number, number][] = [];
        let curr: Node | undefined = current;
        while (curr) {
          path.unshift([curr.r, curr.c]);
          curr = curr.parent;
        }
        return path;
      }

      closedSet.add(`${current.r}_${current.c}`);

      for (let i = 0; i < 4; i++) {
        const nr = current.r + ACTIONS[i][0];
        const nc = current.c + ACTIONS[i][1];

        if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) continue;
        if (this.isWall(nr, nc)) continue;
        if (this.isHazard(nr, nc)) continue;
        if (closedSet.has(`${nr}_${nc}`)) continue;

        const g = current.g + 1;
        const heuristic = h(nr, nc);
        const f = g + heuristic;

        const existing = openSet.find((node) => node.r === nr && node.c === nc);
        if (existing) {
          if (g < existing.g) {
            existing.g = g;
            existing.f = f;
            existing.parent = current;
          }
        } else {
          openSet.push({ r: nr, c: nc, g, h: heuristic, f, parent: current });
        }
      }
    }

    return [];
  }

  getNextAStarAction(current: [number, number]): number {
    const path = this.computeAStarPath(current, this.goalPos);
    if (path.length < 2) {
      // No path found or already at goal; attempt move toward goal
      const dr = this.goalPos[0] - current[0];
      const dc = this.goalPos[1] - current[1];
      if (Math.abs(dr) > Math.abs(dc)) {
        return dr > 0 ? 2 : 0;
      }
      return dc > 0 ? 1 : 3;
    }
    const next = path[1];
    const dr = next[0] - current[0];
    const dc = next[1] - current[1];
    if (dr === -1) return 0;
    if (dc === 1) return 1;
    if (dr === 1) return 2;
    return 3;
  }

  step(actionOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    const stateKey = this.getStateKey(s.agentRow, s.agentCol);
    let intendedAction: number;

    if (actionOverride !== undefined) {
      intendedAction = actionOverride;
    } else if (s.controller === "search") {
      intendedAction = this.getNextAStarAction([s.agentRow, s.agentCol]);
    } else {
      intendedAction = this.selectAction(s.agentRow, s.agentCol, true);
    }

    // Stochastic slip dynamics
    let actualAction = intendedAction;
    let didSlip = false;
    if (Math.random() < s.slipRate) {
      didSlip = true;
      // Slip orthogonally to intended movement direction
      if (intendedAction === 0 || intendedAction === 2) {
        // Up or Down slips Left or Right
        actualAction = Math.random() < 0.5 ? 1 : 3;
      } else {
        // Left or Right slips Up or Down
        actualAction = Math.random() < 0.5 ? 0 : 2;
      }
      s.lastSlip = {
        intended: ACTION_NAMES[intendedAction],
        actual: ACTION_NAMES[actualAction],
      };
    } else {
      s.lastSlip = null;
    }

    // Apply movement
    const dr = ACTIONS[actualAction][0];
    const dc = ACTIONS[actualAction][1];
    const targetR = s.agentRow + dr;
    const targetC = s.agentCol + dc;

    let newRow = s.agentRow;
    let newCol = s.agentCol;
    let reward = -1.0;
    let done = false;

    // Check boundary & walls
    if (
      targetR >= 0 &&
      targetR < this.size &&
      targetC >= 0 &&
      targetC < this.size &&
      !this.isWall(targetR, targetC)
    ) {
      newRow = targetR;
      newCol = targetC;
    } else {
      reward = -2.0; // Wall bounce
    }

    s.agentRow = newRow;
    s.agentCol = newCol;
    s.stepCount += 1;
    s.visitedPath.push([newRow, newCol]);

    // Check hazard pit
    if (this.isHazard(newRow, newCol)) {
      reward = -100.0;
      s.isOver = true;
      s.won = false;
      s.failedBySlip = didSlip;
      done = true;
    } else if (newRow === this.goalPos[0] && newCol === this.goalPos[1]) {
      // Reached Goal!
      reward = 100.0;
      s.isOver = true;
      s.won = true;
      s.failedBySlip = false;
      done = true;
    } else if (s.stepCount >= 100) {
      reward = -10.0;
      s.isOver = true;
      s.won = false;
      done = true;
    }

    s.lastReward = reward;

    // RL Q-update (learning occurs for RL controller or during training)
    if (s.controller === "rl") {
      const nextKey = this.getStateKey(newRow, newCol);
      const qCurrent = this.getQValues(stateKey);
      const nextQ = this.getQValues(nextKey);

      const target = done
        ? reward
        : reward +
          this.hyperparams.discountFactor *
            (this.hyperparams.algorithm === "sarsa"
              ? nextQ[this.selectAction(newRow, newCol, true)]
              : Math.max(...nextQ));

      qCurrent[intendedAction] +=
        this.hyperparams.learningRate * (target - qCurrent[intendedAction]);
      s.policyArrows = this.getPolicyMap();
    }

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    avgReward: number;
  } {
    let wins = 0;
    let totalReward = 0;
    const prevController = this.state.controller;
    this.state.controller = "rl";

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let epReward = 0;
      let steps = 0;

      while (!this.state.isOver && steps < 120) {
        const { reward, done } = this.step();
        epReward += reward;
        steps++;
        if (done) break;
      }

      if (this.state.won) {
        wins++;
      }
      totalReward += epReward;

      this.hyperparams.explorationRate = Math.max(
        0.02,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    this.state.controller = prevController;
    this.state.policyArrows = this.getPolicyMap();
    return {
      episodes,
      wins,
      avgReward: episodes > 0 ? totalReward / episodes : 0,
    };
  }
}
