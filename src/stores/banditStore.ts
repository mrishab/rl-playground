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
  setAlgorithm: (algorithm: BanditAlgorithm) => void;
  setConfig: (patch: Partial<BanditRunConfig>) => void;
  reset: () => void;
  setIsRunning: (running: boolean) => void;
};

const DEFAULT_CONFIG: BanditRunConfig = {
  numArms: 10,
  algorithm: "epsilon-greedy",
  epsilon: 0.1,
  c: 2.0,
  initialQ: 0.0,
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

  setAlgorithm: (algorithm) => {
    get().setConfig({ algorithm });
  },

  setConfig: (patch) => {
    const current = get().config;
    const nextConfig = { ...current, ...patch };

    const requiresReset =
      (patch.algorithm !== undefined &&
        patch.algorithm !== current.algorithm) ||
      (patch.numArms !== undefined && patch.numArms !== current.numArms) ||
      (patch.initialQ !== undefined && patch.initialQ !== current.initialQ);

    if (requiresReset) {
      engine = new BanditEngine(nextConfig);
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
    } else {
      engine.updateConfig(patch);
      set({ config: nextConfig });
    }
  },

  reset: () => {
    engine.reset();
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
