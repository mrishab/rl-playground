import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BanditEngine } from "../src/lib/rl/banditEngine.ts";

describe("Multi-Armed Bandit Engine", () => {
  it("should initialize with 10 arms and default parameters", () => {
    const bandit = new BanditEngine();
    assert.equal(bandit.arms.length, 10);
    assert.equal(bandit.stepCount, 0);
    assert.equal(bandit.cumulativeReward, 0);
    assert.equal(bandit.history.length, 0);
  });

  it("should select arms and record step results", () => {
    const bandit = new BanditEngine({
      algorithm: "epsilon-greedy",
      epsilon: 0.1,
    });
    const res = bandit.step();
    assert.equal(res.step, 1);
    assert.ok(res.chosenArm >= 0 && res.chosenArm < 10);
    assert.ok(typeof res.reward === "number");
    assert.equal(bandit.stepCount, 1);
    assert.equal(bandit.history.length, 1);
  });

  it("should step a batch of 100 steps and track average reward", () => {
    const bandit = new BanditEngine({ algorithm: "ucb1", c: 2.0 });
    const batch = bandit.stepBatch(100);
    assert.equal(batch.length, 100);
    assert.equal(bandit.stepCount, 100);
    // All arms should have been pulled at least once under UCB1
    for (const arm of bandit.arms) {
      assert.ok(arm.pulls >= 1);
    }
  });

  it("should support optimistic initial values with 0 exploration", () => {
    const bandit = new BanditEngine({
      algorithm: "optimistic-initial",
      initialQ: 5.0,
    });
    assert.equal(bandit.arms[0].estimatedValue, 5.0);
    bandit.stepBatch(50);
    assert.equal(bandit.stepCount, 50);
  });

  it("should reset correctly", () => {
    const bandit = new BanditEngine();
    bandit.stepBatch(20);
    assert.equal(bandit.stepCount, 20);
    bandit.reset();
    assert.equal(bandit.stepCount, 0);
    assert.equal(bandit.history.length, 0);
    assert.equal(bandit.cumulativeReward, 0);
  });
});
