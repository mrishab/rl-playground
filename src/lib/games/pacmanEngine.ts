import type { GameHyperparameters, Ghost, PacmanState } from "./types";

export const PACMAN_GRID_SIZE = 9;

// 1 = Wall, 0 = Corridor
export const DEFAULT_MAZE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const POWER_PELLET_LOCATIONS: [number, number][] = [
  [1, 1],
  [1, 7],
  [7, 1],
  [7, 7],
];

export class PacmanEngine {
  maze = DEFAULT_MAZE;
  state: PacmanState;
  qTable: Map<string, number[]> = new Map();
  hyperparams: GameHyperparameters;
  stepCounter = 0;

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.2,
      discountFactor: 0.95,
      explorationRate: 0.15,
      epsilonDecay: 0.997,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  createInitialState(): PacmanState {
    const pellets = new Set<string>();
    const powerPellets = new Set<string>();

    for (const [r, c] of POWER_PELLET_LOCATIONS) {
      powerPellets.add(`${r},${c}`);
    }

    for (let r = 0; r < PACMAN_GRID_SIZE; r++) {
      for (let c = 0; c < PACMAN_GRID_SIZE; c++) {
        if (this.maze[r][c] === 0) {
          const key = `${r},${c}`;
          if (
            !powerPellets.has(key) &&
            !(r === 6 && c === 4) &&
            !(r === 2 && c === 4)
          ) {
            pellets.add(key);
          }
        }
      }
    }

    const ghosts: Ghost[] = [
      { id: "blinky", row: 2, col: 4, color: "#ef4444", isFrightened: false },
      { id: "pinky", row: 3, col: 4, color: "#06b6d4", isFrightened: false },
    ];

    return {
      pacman: { row: 6, col: 4 },
      ghosts,
      pellets,
      powerPellets,
      frightenedTimer: 0,
      score: 0,
      pelletsRemaining: pellets.size + powerPellets.size,
      ghostsEaten: 0,
      isOver: false,
      won: false,
      lastReward: 0,
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

  getStateKey(state: PacmanState): string {
    const { pacman, ghosts, frightenedTimer, pellets, powerPellets } = state;
    const isFrightened = frightenedTimer > 0 ? 1 : 0;

    // Find closest ghost
    let minDist = 999;
    let closestG = ghosts[0];
    for (const g of ghosts) {
      const d = Math.abs(g.row - pacman.row) + Math.abs(g.col - pacman.col);
      if (d < minDist) {
        minDist = d;
        closestG = g;
      }
    }

    const gdr = Math.sign(closestG.row - pacman.row);
    const gdc = Math.sign(closestG.col - pacman.col);
    const danger = minDist <= 2 ? 1 : 0;

    // Nearest pellet or power pellet
    let minPelletDist = 999;
    let pdr = 0;
    let pdc = 0;

    const allPellets = [...powerPellets, ...pellets];
    for (const p of allPellets) {
      const [pr, pc] = p.split(",").map(Number);
      const d = Math.abs(pr - pacman.row) + Math.abs(pc - pacman.col);
      if (d < minPelletDist) {
        minPelletDist = d;
        pdr = Math.sign(pr - pacman.row);
        pdc = Math.sign(pc - pacman.col);
      }
    }

    return `${pacman.row}_${pacman.col}_${gdr}_${gdc}_${danger}_${isFrightened}_${pdr}_${pdc}`;
  }

  getQValues(stateKey: string): number[] {
    let q = this.qTable.get(stateKey);
    if (!q) {
      q = [0, 0, 0, 0, 0]; // UP, RIGHT, DOWN, LEFT, STAY
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  selectAction(stateKey: string, explore = true): number {
    const q = this.getQValues(stateKey);
    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return Math.floor(Math.random() * 5);
    }
    let best = 0;
    let maxVal = q[0];
    for (let a = 1; a < 5; a++) {
      if (q[a] > maxVal) {
        maxVal = q[a];
        best = a;
      }
    }
    return best;
  }

  getLegalMoves(r: number, c: number): [number, number][] {
    const deltas = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const legal: [number, number][] = [];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < PACMAN_GRID_SIZE &&
        nc >= 0 &&
        nc < PACMAN_GRID_SIZE &&
        this.maze[nr][nc] === 0
      ) {
        legal.push([nr, nc]);
      }
    }
    return legal;
  }

  step(actionOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    this.stepCounter++;
    const stateKey = this.getStateKey(s);
    const action = actionOverride ?? this.selectAction(stateKey, true);

    const actionDeltas = [
      [-1, 0], // UP
      [0, 1], // RIGHT
      [1, 0], // DOWN
      [0, -1], // LEFT
      [0, 0], // STAY
    ];

    const [dr, dc] = actionDeltas[action];
    const nextRow = s.pacman.row + dr;
    const nextCol = s.pacman.col + dc;

    let reward = -0.05; // tiny step penalty
    let done = false;

    // Check wall collision
    if (
      nextRow >= 0 &&
      nextRow < PACMAN_GRID_SIZE &&
      nextCol >= 0 &&
      nextCol < PACMAN_GRID_SIZE &&
      this.maze[nextRow][nextCol] === 0
    ) {
      s.pacman.row = nextRow;
      s.pacman.col = nextCol;
    } else {
      reward -= 0.5; // Bump wall penalty
    }

    const curPosKey = `${s.pacman.row},${s.pacman.col}`;

    // Pellet eating
    if (s.pellets.has(curPosKey)) {
      s.pellets.delete(curPosKey);
      s.score += 10;
      reward += 4.0;
    }

    // Power pellet eating
    if (s.powerPellets.has(curPosKey)) {
      s.powerPellets.delete(curPosKey);
      s.score += 50;
      s.frightenedTimer = 16;
      reward += 15.0;
      for (const g of s.ghosts) g.isFrightened = true;
    }

    // Update frightened timer
    if (s.frightenedTimer > 0) {
      s.frightenedTimer -= 1;
      if (s.frightenedTimer === 0) {
        for (const g of s.ghosts) g.isFrightened = false;
      }
    }

    // Move Ghosts
    for (const g of s.ghosts) {
      // In frightened mode, move every 2 steps
      if (g.isFrightened && this.stepCounter % 2 !== 0) continue;

      const legal = this.getLegalMoves(g.row, g.col);
      if (legal.length === 0) continue;

      let chosen = legal[0];
      let bestDist = g.isFrightened ? -1 : 999;

      for (const [nr, nc] of legal) {
        const d = Math.abs(nr - s.pacman.row) + Math.abs(nc - s.pacman.col);
        if (g.isFrightened) {
          // Run away
          if (d > bestDist) {
            bestDist = d;
            chosen = [nr, nc];
          }
        } else {
          // Pursue
          if (d < bestDist) {
            bestDist = d;
            chosen = [nr, nc];
          }
        }
      }

      g.row = chosen[0];
      g.col = chosen[1];

      // Ghost collision check
      if (g.row === s.pacman.row && g.col === s.pacman.col) {
        if (g.isFrightened) {
          // Eat Ghost!
          s.score += 200;
          s.ghostsEaten += 1;
          reward += 35.0;
          g.row = 2;
          g.col = 4;
          g.isFrightened = false;
        } else {
          // Pac-Man caught by Ghost!
          s.isOver = true;
          reward = -40.0;
          done = true;
        }
      }
    }

    s.pelletsRemaining = s.pellets.size + s.powerPellets.size;

    // Win condition: All pellets eaten
    if (s.pelletsRemaining === 0) {
      s.isOver = true;
      s.won = true;
      s.score += 500;
      reward += 80.0;
      done = true;
    }

    s.lastReward = reward;

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
    avgReward: number;
    pelletsCleared: number;
  } {
    let wins = 0;
    let totalReward = 0;
    let totalPellets = 0;

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let epReward = 0;
      let steps = 0;

      while (!this.state.isOver && steps < 300) {
        const { reward, done } = this.step();
        epReward += reward;
        steps++;
        if (done) break;
      }

      if (this.state.won) wins++;
      totalPellets += 32 - this.state.pelletsRemaining;
      totalReward += epReward;

      this.hyperparams.explorationRate = Math.max(
        0.03,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    return {
      episodes,
      wins,
      avgReward: totalReward / episodes,
      pelletsCleared: totalPellets / episodes,
    };
  }
}
