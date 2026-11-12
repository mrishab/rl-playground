import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DPEngine } from "../src/lib/rl/dpEngine.ts";
import type { RLEnvironmentRules } from "../src/lib/rl/types.ts";

const RULES: RLEnvironmentRules = {
  gridSize: 4,
  stepReward: -1,
  goalReward: 10,
  hazardPenalty: -20,
  slipProbability: 0,
  hazardIsTerminal: true,
};

describe("Dynamic Programming Engine", () => {
  it("should initialize values to 0", () => {
    const dp = new DPEngine(RULES, 0.9, 0.001, [0, 0], [3, 3]);
    assert.equal(dp.values["0,0"], 0);
    assert.equal(dp.sweepCount, 0);
    assert.equal(dp.isConverged, false);
  });

  it("should perform value iteration step and decrease delta", () => {
    const dp = new DPEngine(RULES, 0.9, 0.001, [0, 0], [3, 3]);
    const sweep1 = dp.stepValueIteration();
    assert.equal(dp.sweepCount, 1);
    assert.ok(sweep1.delta > 0);
  });

  it("should converge on a deterministic 4x4 grid", () => {
    const dp = new DPEngine(RULES, 0.9, 0.001, [0, 0], [3, 3]);
    const sweeps = dp.runUntilConvergence(100);
    assert.ok(sweeps > 0);
    assert.ok(dp.isConverged);
    // Goal neighbor should have value close to 10 - 1 = 9
    const neighborV = dp.values["3,2"];
    assert.ok(neighborV > 5);
  });

  it("should inspect state with Bellman equation details", () => {
    const dp = new DPEngine(RULES, 0.9, 0.001, [0, 0], [3, 3]);
    dp.runUntilConvergence(50);
    const inspection = dp.inspectState(0, 0);
    assert.equal(inspection.state[0], 0);
    assert.equal(inspection.state[1], 0);
    assert.ok(inspection.formula.length > 0);
    assert.ok(inspection.actionValues[0].transitions.length > 0);
  });
});
