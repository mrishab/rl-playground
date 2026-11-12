import { create } from "zustand";
import { RLEngine, type QTable, stateKey } from "../lib/rl/rlEngine";
import type {
  RLEnvironmentRules,
  RLHyperparameters,
  SmartObstacle,
  ObstacleStrategy,
  TransitionLog,
} from "../lib/rl/types";
import {
  simulateBFSAgainstObstacles,
  type BFSComparisonResult,
} from "../lib/rl/bfsSearch";

export type RLPresetName =
  | "cliff"
  | "maze"
  | "simple"
  | "empty"
  | "smart"
  | "frozen-lake"
  | "sutton-gridworld";

export type RLStoreState = {
  gridSize: number;
  startPos: [number, number];
  agentPos: [number, number];
  goalPos: [number, number];
  hazards: [number, number][];
  obstacles: [number, number][];
  muds: [number, number][];
  ices: [number, number][];
  smartObstacles: SmartObstacle[];
  initialSmartObstacles: SmartObstacle[];
  activeStrategy: ObstacleStrategy;
  rules: RLEnvironmentRules;
  params: RLHyperparameters;
  qTable: QTable;
  stateVisits: Record<string, number>;
  totalEpisodes: number;
  rewardHistory: number[];
  stepsHistory: number[];
  tdHistory: number[];
  successCount: number;
  isSimulating: boolean;
  showBFSPath: boolean;
  showValueHeatmap: boolean;
  showPolicyArrows: boolean;
  showQRose: boolean;
  showVisitHeatmap: boolean;
  inspectedCell: [number, number] | null;
  lastTransition: TransitionLog | null;
  bfsResult: BFSComparisonResult;

  setGridSize: (size: number) => void;
  setRules: (rules: Partial<RLEnvironmentRules>) => void;
  setParams: (params: Partial<RLHyperparameters>) => void;
  setActiveStrategy: (strategy: ObstacleStrategy) => void;
  updateObstacleStrategy: (id: string, strategy: ObstacleStrategy) => void;
  removeSmartObstacle: (id: string) => void;
  toggleCell: (
    r: number,
    c: number,
    tool:
      | "hazard"
      | "obstacle"
      | "goal"
      | "agent"
      | "smart-obstacle"
      | "mud"
      | "ice"
      | "clear",
  ) => void;
  trainEpisodes: (count: number) => void;
  stepSimulation: () => void;
  stepSingleTransition: () => void;
  setSimulating: (simulating: boolean) => void;
  toggleShowBFSPath: () => void;
  toggleLayer: (layer: "heatmap" | "arrows" | "qrose" | "visits") => void;
  setInspectedCell: (cell: [number, number] | null) => void;
  resetQTable: () => void;
  resetEnvironment: () => void;
  loadPreset: (name: RLPresetName) => void;
};

const DEFAULT_RULES: RLEnvironmentRules = {
  gridSize: 5,
  stepReward: -1,
  goalReward: 50,
  hazardPenalty: -30,
  slipProbability: 0.05,
  hazardIsTerminal: false,
  smartObstaclePenalty: -40,
  smartObstacleIsTerminal: false,
};

const DEFAULT_PARAMS: RLHyperparameters = {
  learningRate: 0.2,
  discountFactor: 0.95,
  explorationRate: 0.2,
  algorithm: "q-learning",
};

const DEFAULT_HAZARDS: [number, number][] = [
  [1, 2],
  [2, 2],
  [3, 2],
];

const DEFAULT_OBSTACLES: [number, number][] = [
  [2, 1],
  [2, 3],
];

const DEFAULT_SMART_OBSTACLES: SmartObstacle[] = [
  {
    id: "default-patrol",
    r: 1,
    c: 1,
    strategy: "patrol",
    patrolDir: [1, 0],
  },
];

const STRATEGY_ORDER: ObstacleStrategy[] = [
  "patrol",
  "chase",
  "ambush",
  "guard",
  "random",
];

function buildEngine(state: {
  rules: RLEnvironmentRules;
  params: RLHyperparameters;
  startPos: [number, number];
  goalPos: [number, number];
  hazards: [number, number][];
  obstacles: [number, number][];
  smartObstacles: SmartObstacle[];
  muds?: [number, number][];
  ices?: [number, number][];
  qTable: QTable;
  stateVisits?: Record<string, number>;
}): RLEngine {
  const engine = new RLEngine(
    state.rules,
    state.params,
    state.startPos,
    state.goalPos,
    state.hazards,
    state.obstacles,
    state.smartObstacles,
    state.muds || [],
    state.ices || [],
  );
  const clonedQ: QTable = {};
  for (const k of Object.keys(state.qTable)) {
    clonedQ[k] = [...state.qTable[k]];
  }
  engine.qTable = clonedQ;
  if (state.stateVisits) {
    engine.stateVisits = { ...state.stateVisits };
  }
  return engine;
}

export const useRLStore = create<RLStoreState>((set, get) => {
  const initialEngine = new RLEngine(
    DEFAULT_RULES,
    DEFAULT_PARAMS,
    [0, 0],
    [4, 4],
    DEFAULT_HAZARDS,
    DEFAULT_OBSTACLES,
    DEFAULT_SMART_OBSTACLES,
  );

  const initialBFS = simulateBFSAgainstObstacles(
    5,
    [0, 0],
    [4, 4],
    DEFAULT_OBSTACLES,
    DEFAULT_SMART_OBSTACLES,
  );

  return {
    gridSize: 5,
    startPos: [0, 0],
    agentPos: [0, 0],
    goalPos: [4, 4],
    hazards: DEFAULT_HAZARDS,
    obstacles: DEFAULT_OBSTACLES,
    muds: [],
    ices: [],
    smartObstacles: DEFAULT_SMART_OBSTACLES.map((o) => ({ ...o })),
    initialSmartObstacles: DEFAULT_SMART_OBSTACLES.map((o) => ({ ...o })),
    activeStrategy: "patrol",
    rules: DEFAULT_RULES,
    params: DEFAULT_PARAMS,
    qTable: initialEngine.qTable,
    stateVisits: {},
    totalEpisodes: 0,
    rewardHistory: [],
    stepsHistory: [],
    tdHistory: [],
    successCount: 0,
    isSimulating: false,
    showBFSPath: true,
    showValueHeatmap: true,
    showPolicyArrows: true,
    showQRose: false,
    showVisitHeatmap: false,
    inspectedCell: null,
    lastTransition: null,
    bfsResult: initialBFS,

    setGridSize: (size: number) => {
      const clamped = Math.max(3, Math.min(12, size));
      const s = get();
      const newGoal: [number, number] = [clamped - 1, clamped - 1];
      const validFilter = ([r, c]: [number, number]) =>
        r < clamped && c < clamped;

      const newHazards = s.hazards.filter(validFilter);
      const newObs = s.obstacles.filter(validFilter);
      const newMuds = s.muds.filter(validFilter);
      const newIces = s.ices.filter(validFilter);
      const newSmart = s.initialSmartObstacles
        .filter((o) => o.r < clamped && o.c < clamped)
        .map((o) => ({ ...o }));

      const newRules = { ...s.rules, gridSize: clamped };
      const bfsResult = simulateBFSAgainstObstacles(
        clamped,
        [0, 0],
        newGoal,
        newObs,
        newSmart,
      );

      set({
        gridSize: clamped,
        startPos: [0, 0],
        agentPos: [0, 0],
        goalPos: newGoal,
        hazards: newHazards,
        obstacles: newObs,
        muds: newMuds,
        ices: newIces,
        smartObstacles: newSmart,
        initialSmartObstacles: newSmart.map((o) => ({ ...o })),
        rules: newRules,
        bfsResult,
        inspectedCell: null,
      });
      get().resetQTable();
    },

    setRules: (rulesPatch) => {
      set((s) => {
        const nextRules = { ...s.rules, ...rulesPatch };
        return { rules: nextRules };
      });
    },

    setParams: (paramsPatch) => {
      set((s) => {
        const nextParams = { ...s.params, ...paramsPatch };
        return { params: nextParams };
      });
    },

    setActiveStrategy: (strategy) => set({ activeStrategy: strategy }),

    updateObstacleStrategy: (id, strategy) => {
      set((s) => {
        const updateList = (list: SmartObstacle[]) =>
          list.map((o) => (o.id === id ? { ...o, strategy } : o));
        const updatedInitial = updateList(s.initialSmartObstacles);
        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          s.startPos,
          s.goalPos,
          s.obstacles,
          updatedInitial,
        );
        return {
          initialSmartObstacles: updatedInitial,
          smartObstacles: updateList(s.smartObstacles),
          bfsResult,
        };
      });
    },

    removeSmartObstacle: (id) => {
      set((s) => {
        const updatedInitial = s.initialSmartObstacles.filter(
          (o) => o.id !== id,
        );
        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          s.startPos,
          s.goalPos,
          s.obstacles,
          updatedInitial,
        );
        return {
          initialSmartObstacles: updatedInitial,
          smartObstacles: s.smartObstacles.filter((o) => o.id !== id),
          bfsResult,
        };
      });
    },

    toggleCell: (r, c, tool) => {
      const s = get();
      if (tool === "agent") {
        if (r === s.goalPos[0] && c === s.goalPos[1]) return;
        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          [r, c],
          s.goalPos,
          s.obstacles,
          s.initialSmartObstacles,
        );
        set({
          startPos: [r, c],
          agentPos: [r, c],
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          obstacles: s.obstacles.filter(([or, oc]) => !(or === r && oc === c)),
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
          smartObstacles: s.smartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          initialSmartObstacles: s.initialSmartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          bfsResult,
        });
        return;
      }

      if (tool === "goal") {
        if (r === s.startPos[0] && c === s.startPos[1]) return;
        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          s.startPos,
          [r, c],
          s.obstacles,
          s.initialSmartObstacles,
        );
        set({
          goalPos: [r, c],
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          obstacles: s.obstacles.filter(([or, oc]) => !(or === r && oc === c)),
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
          smartObstacles: s.smartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          initialSmartObstacles: s.initialSmartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          bfsResult,
        });
        return;
      }

      // Protect start and goal positions from being overwritten by other tools
      if (
        (r === s.startPos[0] && c === s.startPos[1]) ||
        (r === s.goalPos[0] && c === s.goalPos[1])
      ) {
        return;
      }

      if (tool === "smart-obstacle") {
        const existingIdx = s.initialSmartObstacles.findIndex(
          (o) => o.r === r && o.c === c,
        );
        let nextInitial: SmartObstacle[];
        if (existingIdx >= 0) {
          const current = s.initialSmartObstacles[existingIdx];
          const currOrderIdx = STRATEGY_ORDER.indexOf(current.strategy);
          if (currOrderIdx < STRATEGY_ORDER.length - 1) {
            const nextStrategy = STRATEGY_ORDER[currOrderIdx + 1];
            nextInitial = s.initialSmartObstacles.map((o, idx) =>
              idx === existingIdx ? { ...o, strategy: nextStrategy } : o,
            );
          } else {
            nextInitial = s.initialSmartObstacles.filter(
              (_, idx) => idx !== existingIdx,
            );
          }
        } else {
          const newObs: SmartObstacle = {
            id: `so-${Date.now()}-${r}-${c}`,
            r,
            c,
            strategy: s.activeStrategy,
            patrolDir: [0, 1],
          };
          nextInitial = [...s.initialSmartObstacles, newObs];
        }

        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          s.startPos,
          s.goalPos,
          s.obstacles,
          nextInitial,
        );

        set({
          initialSmartObstacles: nextInitial,
          smartObstacles: nextInitial.map((o) => ({ ...o })),
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          obstacles: s.obstacles.filter(([or, oc]) => !(or === r && oc === c)),
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
          bfsResult,
        });
        return;
      }

      if (tool === "clear") {
        const nextInitial = s.initialSmartObstacles.filter(
          (o) => !(o.r === r && o.c === c),
        );
        const nextObs = s.obstacles.filter(
          ([or, oc]) => !(or === r && oc === c),
        );
        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          s.startPos,
          s.goalPos,
          nextObs,
          nextInitial,
        );
        set({
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          obstacles: nextObs,
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
          initialSmartObstacles: nextInitial,
          smartObstacles: nextInitial.map((o) => ({ ...o })),
          bfsResult,
        });
        return;
      }

      if (tool === "hazard") {
        const exists = s.hazards.some(([hr, hc]) => hr === r && hc === c);
        set({
          hazards: exists
            ? s.hazards.filter(([hr, hc]) => !(hr === r && hc === c))
            : [...s.hazards, [r, c]],
          obstacles: s.obstacles.filter(([or, oc]) => !(or === r && oc === c)),
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
          smartObstacles: s.smartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          initialSmartObstacles: s.initialSmartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
        });
        return;
      }

      if (tool === "mud") {
        const exists = s.muds.some(([mr, mc]) => mr === r && mc === c);
        set({
          muds: exists
            ? s.muds.filter(([mr, mc]) => !(mr === r && mc === c))
            : [...s.muds, [r, c]],
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          obstacles: s.obstacles.filter(([or, oc]) => !(or === r && oc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
        });
        return;
      }

      if (tool === "ice") {
        const exists = s.ices.some(([ir, ic]) => ir === r && ic === c);
        set({
          ices: exists
            ? s.ices.filter(([ir, ic]) => !(ir === r && ic === c))
            : [...s.ices, [r, c]],
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          obstacles: s.obstacles.filter(([or, oc]) => !(or === r && oc === c)),
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
        });
        return;
      }

      if (tool === "obstacle") {
        const exists = s.obstacles.some(([or, oc]) => or === r && oc === c);
        const nextObs: [number, number][] = exists
          ? s.obstacles.filter(([or, oc]) => !(or === r && oc === c))
          : [...s.obstacles, [r, c]];
        const bfsResult = simulateBFSAgainstObstacles(
          s.gridSize,
          s.startPos,
          s.goalPos,
          nextObs,
          s.initialSmartObstacles,
        );
        set({
          obstacles: nextObs,
          hazards: s.hazards.filter(([hr, hc]) => !(hr === r && hc === c)),
          muds: s.muds.filter(([mr, mc]) => !(mr === r && mc === c)),
          ices: s.ices.filter(([ir, ic]) => !(ir === r && ic === c)),
          smartObstacles: s.smartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          initialSmartObstacles: s.initialSmartObstacles.filter(
            (o) => !(o.r === r && o.c === c),
          ),
          bfsResult,
        });
      }
    },

    trainEpisodes: (count: number) => {
      const s = get();
      const engine = buildEngine(s);
      const results = engine.trainBatch(count);

      const newRewards = [...s.rewardHistory];
      const newSteps = [...s.stepsHistory];
      const newTds = [...s.tdHistory];
      let newSuccess = s.successCount;

      for (const res of results) {
        newRewards.push(res.totalReward);
        newSteps.push(res.steps);
        newTds.push(res.tdError || 0);
        if (res.reachedGoal) newSuccess++;
      }

      set({
        qTable: engine.qTable,
        stateVisits: engine.stateVisits,
        totalEpisodes: s.totalEpisodes + count,
        rewardHistory: newRewards.slice(-300),
        stepsHistory: newSteps.slice(-300),
        tdHistory: newTds.slice(-300),
        successCount: newSuccess,
        lastTransition: engine.lastTransition,
      });
    },

    stepSingleTransition: () => {
      const s = get();
      const [r, c] = s.agentPos;
      const isAtGoal = r === s.goalPos[0] && c === s.goalPos[1];
      const isAtTerminalHazard =
        s.rules.hazardIsTerminal &&
        s.hazards.some(([hr, hc]) => hr === r && hc === c);
      const isAtTerminalObs =
        (s.rules.smartObstacleIsTerminal ?? true) &&
        s.smartObstacles.some((o) => o.r === r && o.c === c);

      if (isAtGoal || isAtTerminalHazard || isAtTerminalObs) {
        set({
          agentPos: [...s.startPos],
          smartObstacles: s.initialSmartObstacles.map((o) => ({ ...o })),
        });
        return;
      }

      const engine = buildEngine(s);
      const bestAction = engine.chooseAction(r, c);
      const stepRes = engine.step(r, c, bestAction);
      const { nextPos, reward, isTerminal } = stepRes;

      const alpha = s.params.learningRate;
      const gamma = s.params.discountFactor;
      const q = engine.getQValues(r, c);
      const qBefore = q[bestAction];
      const nextQ = engine.getQValues(nextPos[0], nextPos[1]);
      const maxNextQ = isTerminal ? 0 : Math.max(...nextQ);
      const targetQ = reward + gamma * maxNextQ;
      q[bestAction] += alpha * (targetQ - qBefore);
      engine.qTable[stateKey(r, c)] = q;

      const updatedVisits = {
        ...s.stateVisits,
        [stateKey(r, c)]: (s.stateVisits[stateKey(r, c)] || 0) + 1,
      };

      set({
        agentPos: nextPos,
        smartObstacles: engine.smartObstacles,
        qTable: engine.qTable,
        stateVisits: updatedVisits,
        lastTransition: {
          state: [r, c],
          action: bestAction,
          reward,
          nextState: nextPos,
          qBefore,
          qAfter: q[bestAction],
          targetQ,
          formula: `Q(s,a) ← ${qBefore.toFixed(2)} + ${alpha.toFixed(2)} × [${reward.toFixed(1)} + ${gamma.toFixed(2)} × ${maxNextQ.toFixed(2)} - ${qBefore.toFixed(2)}] = ${q[bestAction].toFixed(2)}`,
        },
      });
    },

    stepSimulation: () => {
      const s = get();
      const [r, c] = s.agentPos;
      const isAtGoal = r === s.goalPos[0] && c === s.goalPos[1];
      const isAtTerminalHazard =
        s.rules.hazardIsTerminal &&
        s.hazards.some(([hr, hc]) => hr === r && hc === c);
      const isAtTerminalObs =
        (s.rules.smartObstacleIsTerminal ?? true) &&
        s.smartObstacles.some((o) => o.r === r && o.c === c);

      if (isAtGoal || isAtTerminalHazard || isAtTerminalObs) {
        set({
          agentPos: [...s.startPos],
          smartObstacles: s.initialSmartObstacles.map((o) => ({ ...o })),
        });
        return;
      }

      const engine = buildEngine(s);
      const bestAction = engine.getBestAction(r, c);
      const { nextPos } = engine.step(r, c, bestAction);
      set({
        agentPos: nextPos,
        smartObstacles: engine.smartObstacles,
      });
    },

    setSimulating: (simulating) => set({ isSimulating: simulating }),

    toggleShowBFSPath: () => set((s) => ({ showBFSPath: !s.showBFSPath })),

    toggleLayer: (layer) => {
      set((s) => {
        if (layer === "heatmap")
          return { showValueHeatmap: !s.showValueHeatmap };
        if (layer === "arrows")
          return { showPolicyArrows: !s.showPolicyArrows };
        if (layer === "qrose") return { showQRose: !s.showQRose };
        if (layer === "visits")
          return { showVisitHeatmap: !s.showVisitHeatmap };
        return {};
      });
    },

    setInspectedCell: (cell) => set({ inspectedCell: cell }),

    resetQTable: () => {
      const s = get();
      const engine = new RLEngine(
        s.rules,
        s.params,
        s.startPos,
        s.goalPos,
        s.hazards,
        s.obstacles,
        s.initialSmartObstacles,
        s.muds,
        s.ices,
      );
      set({
        qTable: engine.qTable,
        stateVisits: {},
        totalEpisodes: 0,
        rewardHistory: [],
        stepsHistory: [],
        tdHistory: [],
        successCount: 0,
        agentPos: [...s.startPos],
        smartObstacles: s.initialSmartObstacles.map((o) => ({ ...o })),
        isSimulating: false,
        lastTransition: null,
      });
    },

    resetEnvironment: () => {
      const g = get().gridSize;
      const bfsResult = simulateBFSAgainstObstacles(
        g,
        [0, 0],
        [g - 1, g - 1],
        [],
        [],
      );
      set({
        hazards: [],
        obstacles: [],
        muds: [],
        ices: [],
        smartObstacles: [],
        initialSmartObstacles: [],
        startPos: [0, 0],
        agentPos: [0, 0],
        goalPos: [g - 1, g - 1],
        bfsResult,
        isSimulating: false,
        inspectedCell: null,
      });
      get().resetQTable();
    },

    loadPreset: (name) => {
      let size = 5;
      let startPos: [number, number] = [0, 0];
      let goalPos: [number, number] = [4, 4];
      let hazards: [number, number][] = [];
      let obstacles: [number, number][] = [];
      let muds: [number, number][] = [];
      let ices: [number, number][] = [];
      let smartObs: SmartObstacle[] = [];
      let rules = { ...get().rules };

      if (name === "cliff") {
        size = 5;
        startPos = [4, 0];
        goalPos = [4, 4];
        hazards = [
          [4, 1],
          [4, 2],
          [4, 3],
        ];
        rules = {
          ...rules,
          gridSize: 5,
          hazardPenalty: -100,
          stepReward: -1,
          hazardIsTerminal: true,
          slipProbability: 0,
        };
      } else if (name === "frozen-lake") {
        size = 5;
        startPos = [0, 0];
        goalPos = [4, 4];
        hazards = [
          [1, 1],
          [1, 3],
          [2, 3],
          [3, 0],
        ];
        ices = [
          [0, 1],
          [0, 2],
          [0, 3],
          [1, 2],
          [2, 1],
          [2, 2],
          [3, 1],
          [3, 2],
        ];
        rules = {
          ...rules,
          gridSize: 5,
          hazardPenalty: -50,
          stepReward: -0.1,
          goalReward: 100,
          hazardIsTerminal: true,
          slipProbability: 0.25,
        };
      } else if (name === "sutton-gridworld") {
        size = 5;
        startPos = [0, 0];
        goalPos = [4, 4];
        muds = [
          [1, 1],
          [1, 2],
          [1, 3],
        ];
        hazards = [
          [3, 1],
          [3, 2],
        ];
        obstacles = [[2, 2]];
        rules = {
          ...rules,
          gridSize: 5,
          stepReward: -0.5,
          goalReward: 50,
          hazardPenalty: -20,
          mudPenalty: -3,
          hazardIsTerminal: false,
          slipProbability: 0,
        };
      } else if (name === "maze") {
        size = 5;
        hazards = [[2, 2]];
        obstacles = [
          [1, 1],
          [2, 1],
          [3, 1],
          [1, 3],
          [2, 3],
          [3, 3],
        ];
        rules = {
          ...rules,
          gridSize: 5,
          hazardPenalty: -40,
          stepReward: -1,
          hazardIsTerminal: false,
          slipProbability: 0,
        };
      } else if (name === "smart") {
        size = 5;
        smartObs = [
          {
            id: "preset-patrol",
            r: 2,
            c: 2,
            strategy: "patrol",
            patrolDir: [0, 1],
          },
          {
            id: "preset-chase",
            r: 4,
            c: 1,
            strategy: "chase",
          },
          {
            id: "preset-guard",
            r: 3,
            c: 3,
            strategy: "guard",
          },
        ];
        hazards = [[1, 0]];
        obstacles = [
          [1, 2],
          [3, 2],
        ];
        rules = {
          ...DEFAULT_RULES,
          gridSize: 5,
          smartObstaclePenalty: -40,
          smartObstacleIsTerminal: false,
        };
      } else if (name === "simple") {
        size = 5;
        hazards = DEFAULT_HAZARDS;
        obstacles = DEFAULT_OBSTACLES;
        smartObs = DEFAULT_SMART_OBSTACLES.map((o) => ({ ...o }));
        rules = DEFAULT_RULES;
      } else {
        size = 5;
        rules = {
          ...DEFAULT_RULES,
          gridSize: 5,
          slipProbability: 0,
          hazardIsTerminal: false,
        };
      }

      const bfsResult = simulateBFSAgainstObstacles(
        size,
        startPos,
        goalPos,
        obstacles,
        smartObs,
      );

      set({
        gridSize: size,
        startPos,
        agentPos: [...startPos],
        goalPos,
        hazards,
        obstacles,
        muds,
        ices,
        smartObstacles: smartObs.map((o) => ({ ...o })),
        initialSmartObstacles: smartObs.map((o) => ({ ...o })),
        rules,
        bfsResult,
        isSimulating: false,
        inspectedCell: null,
      });

      get().resetQTable();
    },
  };
});
