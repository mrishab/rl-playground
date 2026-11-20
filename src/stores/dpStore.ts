import { create } from "zustand";
import { DPEngine, type DPStateInspection } from "../lib/rl/dpEngine";
import type {
  RLEnvironmentRules,
  StateValueTable,
  StatePolicyTable,
} from "../lib/rl/types";

export type DPStoreState = {
  algorithm: "value-iteration" | "policy-iteration";
  rules: RLEnvironmentRules;
  gamma: number;
  theta: number;
  values: StateValueTable;
  policy: StatePolicyTable;
  sweepCount: number;
  maxDelta: number;
  isConverged: boolean;
  inspectedState: DPStateInspection | null;

  setAlgorithm: (algorithm: "value-iteration" | "policy-iteration") => void;
  stepSweep: () => void;
  runToConvergence: () => void;
  inspectCell: (r: number, c: number) => void;
  setGamma: (gamma: number) => void;
  reset: () => void;
};

const DEFAULT_RULES: RLEnvironmentRules = {
  gridSize: 5,
  stepReward: -1,
  goalReward: 10,
  hazardPenalty: -20,
  slipProbability: 0.1,
  hazardIsTerminal: true,
};

const engine = new DPEngine(
  DEFAULT_RULES,
  0.95,
  0.001,
  [0, 0],
  [4, 4],
  [
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  [
    [2, 1],
    [2, 3],
  ],
);

export const useDPStore = create<DPStoreState>((set, get) => ({
  algorithm: "value-iteration",
  rules: DEFAULT_RULES,
  gamma: 0.95,
  theta: 0.001,
  values: { ...engine.values },
  policy: { ...engine.policy },
  sweepCount: 0,
  maxDelta: 0,
  isConverged: false,
  inspectedState: null,

  setAlgorithm: (algorithm) => {
    set({ algorithm });
    get().reset();
  },

  stepSweep: () => {
    const isPI = get().algorithm === "policy-iteration";
    if (isPI) {
      const res = engine.stepPolicyIteration();
      set({
        values: { ...engine.values },
        policy: { ...engine.policy },
        sweepCount: engine.sweepCount,
        maxDelta: res.changes,
        isConverged: res.converged,
        inspectedState: get().inspectedState
          ? engine.inspectState(
              get().inspectedState!.state[0],
              get().inspectedState!.state[1],
            )
          : null,
      });
    } else {
      const res = engine.stepValueIteration();
      set({
        values: { ...engine.values },
        policy: { ...engine.policy },
        sweepCount: engine.sweepCount,
        maxDelta: res.delta,
        isConverged: res.converged,
        inspectedState: get().inspectedState
          ? engine.inspectState(
              get().inspectedState!.state[0],
              get().inspectedState!.state[1],
            )
          : null,
      });
    }
  },

  runToConvergence: () => {
    const isPI = get().algorithm === "policy-iteration";
    if (isPI) {
      engine.runPolicyIteration(30);
    } else {
      engine.runUntilConvergence(200);
    }
    set({
      values: { ...engine.values },
      policy: { ...engine.policy },
      sweepCount: engine.sweepCount,
      maxDelta: isPI ? (engine.isConverged ? 0 : 1) : engine.maxDelta,
      isConverged: engine.isConverged,
      inspectedState: get().inspectedState
        ? engine.inspectState(
            get().inspectedState!.state[0],
            get().inspectedState!.state[1],
          )
        : null,
    });
  },

  inspectCell: (r, c) => {
    const inspection = engine.inspectState(r, c);
    set({ inspectedState: inspection });
  },

  setGamma: (gamma) => {
    engine.gamma = gamma;
    set({ gamma });
    get().reset();
  },

  reset: () => {
    engine.reset();
    set({
      values: { ...engine.values },
      policy: { ...engine.policy },
      sweepCount: 0,
      maxDelta: 0,
      isConverged: false,
      inspectedState: null,
    });
  },
}));
