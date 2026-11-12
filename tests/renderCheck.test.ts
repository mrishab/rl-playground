import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useRLStore } from "../src/stores/rlStore.ts";
import { useBanditStore } from "../src/stores/banditStore.ts";
import { useDPStore } from "../src/stores/dpStore.ts";
import { useSavedAgentsStore } from "../src/stores/savedAgentsStore.ts";
import { useGamesStore } from "../src/stores/gamesStore.ts";

describe("Application State & Action Workflows with Zero Errors", () => {
  it("interacts with GridWorld lab without console errors", () => {
    const errorLogs: unknown[] = [];
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      errorLogs.push(args);
      origError(...args);
    };

    try {
      // Test presets
      useRLStore.getState().loadPreset("cliff");
      assert.equal(useRLStore.getState().hazards.length, 3);

      useRLStore.getState().loadPreset("frozen-lake");
      assert.ok(useRLStore.getState().ices.length > 0);

      useRLStore.getState().loadPreset("sutton-gridworld");
      assert.ok(useRLStore.getState().muds.length > 0);

      useRLStore.getState().loadPreset("smart");
      assert.ok(useRLStore.getState().smartObstacles.length > 0);

      // Test all algorithms
      const algos = [
        "q-learning",
        "sarsa",
        "expected-sarsa",
        "double-q",
        "monte-carlo",
        "value-iteration",
      ] as const;

      for (const algo of algos) {
        useRLStore.getState().setParams({ algorithm: algo });
        useRLStore.getState().trainEpisodes(10);
        assert.ok(useRLStore.getState().totalEpisodes > 0);
      }

      // Test step transition
      useRLStore.getState().stepSingleTransition();
      assert.ok(useRLStore.getState().lastTransition !== null);

      // Test cell editing
      useRLStore.getState().toggleCell(1, 1, "mud");
      useRLStore.getState().toggleCell(1, 2, "ice");
      useRLStore.getState().toggleCell(2, 2, "hazard");

      // Test layers
      useRLStore.getState().toggleLayer("heatmap");
      useRLStore.getState().toggleLayer("arrows");
      useRLStore.getState().toggleLayer("qrose");
      useRLStore.getState().toggleLayer("visits");

      // Test saving agent
      const state = useRLStore.getState();
      const savedStore = useSavedAgentsStore.getState();
      const saved = savedStore.saveAgent({
        name: "Test Q-Agent",
        algorithm: "q-learning",
        algorithmName: "Q-LEARNING",
        hyperparameters: {
          learningRate: 0.2,
          discountFactor: 0.95,
          explorationRate: 0.1,
        },
        metrics: {
          totalEpisodes: state.totalEpisodes,
          successRate: 85,
          finalReward: 48,
          averageSteps: 12,
        },
        gridConfig: {
          gridSize: state.gridSize,
          startPos: state.startPos,
          goalPos: state.goalPos,
          hazards: state.hazards,
          obstacles: state.obstacles,
        },
        qTable: state.qTable,
      });

      assert.ok(saved.id.startsWith("agent-"));
      assert.ok(useSavedAgentsStore.getState().agents.length >= 1);

      // Test export & import
      const exportedJson = useSavedAgentsStore.getState().exportAgents();
      assert.ok(exportedJson.includes("Test Q-Agent"));
      useSavedAgentsStore.getState().deleteAgent(saved.id);

      const importedCount = useSavedAgentsStore
        .getState()
        .importAgents(exportedJson);
      assert.ok(importedCount >= 1);

      // Assert ZERO console errors occurred
      assert.equal(
        errorLogs.length,
        0,
        "Expected 0 console errors during interaction",
      );
    } finally {
      console.error = origError;
    }
  });

  it("interacts with Bandit lab without console errors", () => {
    const errorLogs: unknown[] = [];
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      errorLogs.push(args);
      origError(...args);
    };

    try {
      useBanditStore
        .getState()
        .setConfig({ algorithm: "epsilon-greedy", epsilon: 0.1 });
      useBanditStore.getState().step();
      useBanditStore.getState().stepBatch(20);
      assert.equal(useBanditStore.getState().stepCount, 21);

      useBanditStore.getState().setConfig({ algorithm: "ucb1", c: 2.0 });
      useBanditStore.getState().stepBatch(20);
      assert.equal(useBanditStore.getState().stepCount, 20);

      useBanditStore.getState().setConfig({ algorithm: "thompson-sampling" });
      useBanditStore.getState().stepBatch(20);
      assert.equal(useBanditStore.getState().stepCount, 20);

      useBanditStore
        .getState()
        .setConfig({ algorithm: "optimistic-initial", initialQ: 5.0 });
      useBanditStore.getState().stepBatch(20);
      assert.equal(useBanditStore.getState().stepCount, 20);

      useBanditStore.getState().reset();
      assert.equal(useBanditStore.getState().stepCount, 0);

      assert.equal(
        errorLogs.length,
        0,
        "Expected 0 console errors in Bandit lab",
      );
    } finally {
      console.error = origError;
    }
  });

  it("interacts with Dynamic Programming lab without console errors", () => {
    const errorLogs: unknown[] = [];
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      errorLogs.push(args);
      origError(...args);
    };

    try {
      useDPStore.getState().stepSweep();
      assert.equal(useDPStore.getState().sweepCount, 1);

      useDPStore.getState().inspectCell(1, 1);
      assert.ok(useDPStore.getState().inspectedState !== null);
      assert.ok(useDPStore.getState().inspectedState!.formula.length > 0);

      useDPStore.getState().runToConvergence();
      assert.ok(useDPStore.getState().isConverged);

      useDPStore.getState().reset();
      assert.equal(useDPStore.getState().sweepCount, 0);

      assert.equal(errorLogs.length, 0, "Expected 0 console errors in DP lab");
    } finally {
      console.error = origError;
    }
  });

  it("interacts with Competitive Games lab without console errors", () => {
    const errorLogs: unknown[] = [];
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      errorLogs.push(args);
      origError(...args);
    };

    try {
      const store = useGamesStore.getState();

      // Test Pong
      store.setActiveGame("pong");
      store.stepSingle();
      store.trainBatch(20);
      assert.ok(useGamesStore.getState().metrics.pong.episodes >= 20);
      store.resetEpisode();
      assert.ok(useGamesStore.getState().pongState !== null);

      // Test Pac-Man
      store.setActiveGame("pacman");
      store.stepSingle();
      store.trainBatch(15);
      assert.ok(useGamesStore.getState().metrics.pacman.episodes >= 15);
      store.resetEpisode();
      assert.ok(useGamesStore.getState().pacmanState !== null);

      // Test Chess
      store.setActiveGame("chess");
      store.stepSingle();
      store.trainBatch(10);
      assert.ok(useGamesStore.getState().metrics.chess.episodes >= 10);
      store.resetEpisode();
      assert.ok(useGamesStore.getState().chessState !== null);

      // Test Strategy
      store.setActiveGame("strategy");
      store.stepSingle();
      store.trainBatch(10);
      assert.ok(useGamesStore.getState().metrics.strategy.episodes >= 10);
      store.resetEpisode();
      assert.ok(useGamesStore.getState().strategyState !== null);

      // Test hyperparam updates
      store.setHyperparams({ learningRate: 0.3, explorationRate: 0.2 });
      assert.equal(useGamesStore.getState().hyperparams.learningRate, 0.3);

      // Test speed toggle
      store.setSpeed(5);
      assert.equal(useGamesStore.getState().speed, 5);

      // Test reset all
      store.resetAll();
      assert.equal(useGamesStore.getState().metrics.strategy.episodes, 0);

      store.setActiveGame("chess");
      store.resetAll();
      assert.equal(useGamesStore.getState().metrics.chess.episodes, 0);

      assert.equal(
        errorLogs.length,
        0,
        "Expected 0 console errors in Competitive Games lab",
      );
    } finally {
      console.error = origError;
    }
  });
});
