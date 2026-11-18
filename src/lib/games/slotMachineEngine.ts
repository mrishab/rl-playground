import type {
  ControllerMode,
  GameHyperparameters,
  SlotMachineArm,
  SlotMachineState,
} from "./types";

const REEL_SYMBOLS = ["🍒", "🍋", "🔔", "💎", "7️⃣"];

const INITIAL_ARMS: SlotMachineArm[] = [
  {
    id: 0,
    name: "Cherry Blitz",
    symbol: "🍒",
    color: "#ef4444",
    winProb: 0.55,
    payout: 2,
    pulls: 0,
    wins: 0,
    estimatedQ: 0,
    trueEV: 1.1, // 0.55 * 2
  },
  {
    id: 1,
    name: "Golden Lemon",
    symbol: "🍋",
    color: "#eab308",
    winProb: 0.35,
    payout: 4,
    pulls: 0,
    wins: 0,
    estimatedQ: 0,
    trueEV: 1.4, // 0.35 * 4
  },
  {
    id: 2,
    name: "Lucky Sevens",
    symbol: "7️⃣",
    color: "#10b981",
    winProb: 0.2,
    payout: 10,
    pulls: 0,
    wins: 0,
    estimatedQ: 0,
    trueEV: 2.0, // 0.20 * 10 (Highest EV!)
  },
  {
    id: 3,
    name: "Diamond Bait",
    symbol: "💎",
    color: "#3b82f6",
    winProb: 0.04,
    payout: 25,
    pulls: 0,
    wins: 0,
    estimatedQ: 0,
    trueEV: 1.0, // 0.04 * 25 (High single prize, low long-term EV!)
  },
];

export class SlotMachineEngine {
  arms: SlotMachineArm[];
  state: SlotMachineState;
  hyperparams: GameHyperparameters;
  // Q-table for arms 0..3: Map<string, number[]> where key="bandit"
  qValues: [number, number, number, number] = [0, 0, 0, 0];
  armPullsCount: [number, number, number, number] = [0, 0, 0, 0];

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.15,
      discountFactor: 0.0, // Bandits have no future states (gamma = 0)
      explorationRate: 0.2,
      epsilonDecay: 0.995,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.arms = INITIAL_ARMS.map((a) => ({ ...a }));
    this.state = this.createInitialState();
  }

  createInitialState(): SlotMachineState {
    return {
      machines: this.arms.map((a) => ({ ...a })),
      reels: ["🍒", "7️⃣", "💎"],
      isSpinning: false,
      lastPullArm: 0,
      lastPayout: 0,
      bankroll: 100,
      totalPulls: 0,
      controller: "rl",
      searchStrategyDesc: "Deterministic Greedy (Static choice)",
      lastReward: 0,
      isOver: false,
    };
  }

  setController(controller: ControllerMode): void {
    this.state.controller = controller;
  }

  resetEpisode(): void {
    this.state.isOver = false;
    this.state.bankroll = 100;
    this.state.lastPayout = 0;
    this.state.lastReward = 0;
  }

  resetAll(): void {
    this.qValues = [0, 0, 0, 0];
    this.armPullsCount = [0, 0, 0, 0];
    this.arms = INITIAL_ARMS.map((a) => ({ ...a }));
    const controller = this.state.controller;
    this.state = this.createInitialState();
    this.state.controller = controller;
  }

  selectArmRL(explore = true): number {
    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return Math.floor(Math.random() * 4);
    }
    // Greedy selection based on Q-values with tie-breaking
    let maxQ = -Infinity;
    const candidates: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (this.qValues[i] > maxQ) {
        maxQ = this.qValues[i];
        candidates.length = 0;
        candidates.push(i);
      } else if (this.qValues[i] === maxQ) {
        candidates.push(i);
      }
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  selectArmSearch(): number {
    // Search/CSP fails because there are no state transitions or static paths.
    // A deterministic search agent with no statistical exploration either picks
    // the machine with the highest advertised single max jackpot (Arm 3: $25) or
    // statically sticks to the first positive return without exploring variance.
    // We demonstrate selecting the naive advertised maximum jackpot (Arm 3),
    // which has the lowest expected value ($1.00)!
    return 3;
  }

  step(armOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    let chosenArm = 0;

    if (armOverride !== undefined) {
      chosenArm = armOverride;
    } else if (s.controller === "search") {
      chosenArm = this.selectArmSearch();
    } else {
      chosenArm = this.selectArmRL(true);
    }

    const arm = this.arms[chosenArm];
    const betCost = 1.0;
    const roll = Math.random();
    const won = roll < arm.winProb;

    let payout = 0;
    if (won) {
      payout = arm.payout;
      // All 3 reels show winning symbol
      s.reels = [arm.symbol, arm.symbol, arm.symbol];
      arm.wins += 1;
    } else {
      // Mixed reels
      const pick = () =>
        REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)];
      const r1 = pick();
      const r2 = pick();
      let r3 = pick();
      if (r1 === r2 && r2 === r3) {
        r3 = r1 === "🍒" ? "🍋" : "🍒";
      }
      s.reels = [r1, r2, r3];
    }

    const netReward = payout - betCost;
    arm.pulls += 1;
    this.armPullsCount[chosenArm] += 1;

    // Running sample average Q-update
    const stepSize = this.hyperparams.learningRate;
    this.qValues[chosenArm] += stepSize * (payout - this.qValues[chosenArm]);
    arm.estimatedQ = Number(this.qValues[chosenArm].toFixed(2));

    s.lastPullArm = chosenArm;
    s.lastPayout = payout;
    s.lastReward = netReward;
    s.bankroll = Math.max(0, s.bankroll + netReward);
    s.totalPulls += 1;
    s.machines = this.arms.map((a) => ({ ...a }));

    // Episode ends periodically or on bankroll exhaustion
    const done = s.bankroll <= 0 || s.totalPulls % 50 === 0;
    s.isOver = done;

    return { reward: netReward, done };
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
      const { reward } = this.step();
      if (reward > 0) wins++;
      totalReward += reward;

      this.hyperparams.explorationRate = Math.max(
        0.02,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    this.state.controller = prevController;
    return {
      episodes,
      wins,
      avgReward: episodes > 0 ? totalReward / episodes : 0,
    };
  }
}
