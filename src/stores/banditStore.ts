import { create } from "zustand";
import { BanditEngine } from "../lib/rl/banditEngine";
import type {
  BanditAlgorithm,
  BanditArm,
  BanditRunConfig,
  BanditStepResult,
} from "../lib/rl/types";

export type BanditStoreState = {
  config: BanditRunConfig;
  arms: BanditArm[];
  stepCount: number;
  cumulativeReward: number;
  averageReward: number;
  optimalRate: number;
  history: BanditStepResult[];
  isRunning: boolean;

  step: () => void;
  stepBatch: (count: number) => void;
  pullArm: (armId: number) => void;
  setAlgorithm: (algorithm: BanditAlgorithm) => void;
  setConfig: (patch: Partial<BanditRunConfig>) => void;
  reset: () => void;
  regenerateTestbed: () => void;
  setLockTestbed: (lock: boolean) => void;
  setIsRunning: (running: boolean) => void;
};

const DEFAULT_CONFIG: BanditRunConfig = {
  numArms: 10,
  algorithm: "epsilon-greedy",
  epsilon: 0.1,
  c: 2.0,
  initialQ: 0.0,
  alpha: 0.1,
  estimator: "sample-average",
  lockTestbed: false,
  isStationary: true,
  driftStdDev: 0.01,
};

let engine = new BanditEngine(DEFAULT_CONFIG);

export const useBanditStore = create<BanditStoreState>((set, get) => ({
  config: DEFAULT_CONFIG,
  arms: [...engine.arms],
  stepCount: 0,
  cumulativeReward: 0,
  averageReward: 0,
  optimalRate: 0,
  history: [],
  isRunning: false,

  step: () => {
    engine.step();
    set({
      arms: [...engine.arms],
      stepCount: engine.stepCount,
      cumulativeReward: engine.cumulativeReward,
      averageReward:
        engine.stepCount > 0 ? engine.cumulativeReward / engine.stepCount : 0,
      optimalRate:
        engine.stepCount > 0
          ? (engine.optimalActionPicks / engine.stepCount) * 100
          : 0,
      history: [...engine.history.slice(-300)],
    });
  },

  stepBatch: (count: number) => {
    engine.stepBatch(count);
    set({
      arms: [...engine.arms],
      stepCount: engine.stepCount,
      cumulativeReward: engine.cumulativeReward,
      averageReward:
        engine.stepCount > 0 ? engine.cumulativeReward / engine.stepCount : 0,
      optimalRate:
        engine.stepCount > 0
          ? (engine.optimalActionPicks / engine.stepCount) * 100
          : 0,
      history: [...engine.history.slice(-300)],
    });
  },

  pullArm: (armId: number) => {
    engine.pullArm(armId);
    set({
      arms: [...engine.arms],
      stepCount: engine.stepCount,
      cumulativeReward: engine.cumulativeReward,
      averageReward:
        engine.stepCount > 0 ? engine.cumulativeReward / engine.stepCount : 0,
      optimalRate:
        engine.stepCount > 0
          ? (engine.optimalActionPicks / engine.stepCount) * 100
          : 0,
      history: [...engine.history.slice(-300)],
    });
  },

  setAlgorithm: (algorithm) => {
    const patch: Partial<BanditRunConfig> = { algorithm };
    if (algorithm !== "optimistic-initial") {
      patch.initialQ = 0.0;
    }
    get().setConfig(patch);
  },

  setConfig: (patch) => {
    const current = get().config;
    const nextConfig = { ...current, ...patch };

    if (nextConfig.algorithm !== "optimistic-initial") {
      nextConfig.initialQ = 0.0;
    }

    const requiresReset =
      (patch.algorithm !== undefined &&
        patch.algorithm !== current.algorithm) ||
      (patch.numArms !== undefined && patch.numArms !== current.numArms);

    if (requiresReset) {
      const savedMeans = nextConfig.lockTestbed
        ? engine.arms.map((a) => a.trueMean)
        : null;
      engine = new BanditEngine(nextConfig);
      if (savedMeans && savedMeans.length === engine.arms.length) {
        for (let i = 0; i < engine.arms.length; i++) {
          engine.arms[i].trueMean = savedMeans[i];
        }
        engine.updateArmStats();
      }
      set({
        config: nextConfig,
        arms: [...engine.arms],
        stepCount: 0,
        cumulativeReward: 0,
        averageReward: 0,
        optimalRate: 0,
        history: [],
        isRunning: false,
      });
    } else if (
      patch.initialQ !== undefined &&
      engine.stepCount === 0 &&
      nextConfig.algorithm === "optimistic-initial"
    ) {
      engine.updateConfig(patch);
      for (const a of engine.arms) {
        a.estimatedValue = patch.initialQ;
      }
      engine.updateArmStats();
      set({ config: nextConfig, arms: [...engine.arms] });
    } else {
      engine.updateConfig(patch);
      set({ config: nextConfig });
    }
  },

  setLockTestbed: (lockTestbed: boolean) => {
    get().setConfig({ lockTestbed });
  },

  regenerateTestbed: () => {
    const cfg = { ...get().config, lockTestbed: false };
    engine = new BanditEngine(cfg);
    set({
      config: cfg,
      arms: [...engine.arms],
      stepCount: 0,
      cumulativeReward: 0,
      averageReward: 0,
      optimalRate: 0,
      history: [],
      isRunning: false,
    });
  },

  reset: () => {
    const savedMeans = get().config.lockTestbed
      ? engine.arms.map((a) => a.trueMean)
      : null;
    if (get().config.algorithm !== "optimistic-initial") {
      engine.config.initialQ = 0.0;
    }
    engine.reset();
    if (savedMeans && savedMeans.length === engine.arms.length) {
      for (let i = 0; i < engine.arms.length; i++) {
        engine.arms[i].trueMean = savedMeans[i];
      }
      engine.updateArmStats();
    }
    set({
      arms: [...engine.arms],
      stepCount: 0,
      cumulativeReward: 0,
      averageReward: 0,
      optimalRate: 0,
      history: [],
      isRunning: false,
    });
  },

  setIsRunning: (running) => set({ isRunning: running }),
}));
