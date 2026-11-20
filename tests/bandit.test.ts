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

  it("should allow mid-run epsilon tuning without resetting arms or step count", () => {
    const bandit = new BanditEngine({
      algorithm: "epsilon-greedy",
      epsilon: 0.1,
    });
    bandit.stepBatch(25);
    const initialTrueMeans = bandit.arms.map((a) => a.trueMean);
    assert.equal(bandit.stepCount, 25);

    // Live update epsilon mid-run
    bandit.config.epsilon = 0.4;
    bandit.stepBatch(25);
    assert.equal(bandit.stepCount, 50);
    const newTrueMeans = bandit.arms.map((a) => a.trueMean);
    assert.deepEqual(newTrueMeans, initialTrueMeans);
  });

  it("should isolate optimistic Q0 and not leak into other algorithms", async () => {
    const { useBanditStore } = await import("../src/stores/banditStore.ts");
    const store = useBanditStore.getState();

    // Set optimistic initial with Q0 = 10.0
    store.setConfig({ algorithm: "optimistic-initial", initialQ: 10.0 });
    assert.equal(useBanditStore.getState().config.initialQ, 10.0);
    assert.equal(useBanditStore.getState().arms[0].estimatedValue, 10.0);

    // Switch to epsilon-greedy: Q0 must not leak
    store.setAlgorithm("epsilon-greedy");
    const epsConfig = useBanditStore.getState().config;
    assert.equal(epsConfig.initialQ, 0.0);
    assert.equal(useBanditStore.getState().arms[0].estimatedValue, 0.0);

    // Resetting epsilon-greedy must also stay at 0.0
    store.reset();
    assert.equal(useBanditStore.getState().arms[0].estimatedValue, 0.0);
  });

  it("should use constant alpha to decay optimism gradually rather than wiping out on pull 1", () => {
    const bandit = new BanditEngine({
      algorithm: "optimistic-initial",
      initialQ: 5.0,
      alpha: 0.1,
    });
    // Manually pull arm 0
    bandit.pullArm(0);
    // With initialQ=5.0 and alpha=0.1, Q_1 = 5.0 + 0.1*(R - 5.0).
    // Q_1 must remain high (optimistic), NOT wiped out to R
    assert.ok(bandit.arms[0].estimatedValue > 2.0);
  });

  it("should populate UCB1 exploration bonus and Thompson posterior stats", () => {
    const bandit = new BanditEngine({ algorithm: "ucb1", c: 2.0 });
    bandit.stepBatch(10);
    for (const arm of bandit.arms) {
      assert.ok(typeof arm.ucbBonus === "number");
      assert.ok(typeof arm.posteriorStd === "number");
    }
  });

  it("should break ties uniformly at random in pure greedy", () => {
    const bandit = new BanditEngine({ algorithm: "pure-greedy" });
    const chosenPicks = new Set<number>();
    for (let i = 0; i < 50; i++) {
      chosenPicks.add(bandit.selectArm());
    }
    // With 10 arms at Q=0.0, multiple distinct arms should be picked across 50 trials
    assert.ok(chosenPicks.size > 1);
  });
});
