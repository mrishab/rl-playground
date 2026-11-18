import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SlotMachineEngine } from "../src/lib/games/slotMachineEngine.ts";

describe("Simplified Multi-Armed Bandit Slot Machine Engine", () => {
  it("initializes 4 slot machines with distinct distributions and Lucky Sevens as highest EV", () => {
    const engine = new SlotMachineEngine();
    assert.equal(engine.arms.length, 4);
    assert.equal(engine.arms[0].symbol, "🍒");
    assert.equal(engine.arms[1].symbol, "🍋");
    assert.equal(engine.arms[2].symbol, "7️⃣");
    assert.equal(engine.arms[3].symbol, "💎");

    // Machine 2 has highest true EV (2.0)
    assert.equal(engine.arms[2].trueEV, 2.0);
    assert.ok(engine.arms[2].trueEV > engine.arms[0].trueEV);
    assert.ok(engine.arms[2].trueEV > engine.arms[1].trueEV);
    assert.ok(engine.arms[2].trueEV > engine.arms[3].trueEV);
    assert.equal(engine.state.bankroll, 100);
  });

  it("pulls specific arm, updates bankroll, and generates 3 reels", () => {
    const engine = new SlotMachineEngine();
    const initBankroll = engine.state.bankroll;

    const { reward } = engine.step(0);
    assert.equal(engine.state.totalPulls, 1);
    assert.equal(engine.state.lastPullArm, 0);
    assert.equal(engine.state.reels.length, 3);
    assert.equal(engine.state.bankroll, initBankroll + reward);
    assert.ok(engine.arms[0].pulls === 1);
  });

  it("search mode selects static high-jackpot lure arm", () => {
    const engine = new SlotMachineEngine();
    engine.setController("search");
    assert.equal(engine.state.controller, "search");

    engine.step();
    // Deterministic search heuristic picks Arm 3 (Diamond bait with $25 max payout)
    assert.equal(engine.state.lastPullArm, 3);
  });

  it("trains a batch of pulls, updating running sample average Q-values", () => {
    const engine = new SlotMachineEngine();
    const result = engine.trainBatch(40);

    assert.equal(result.episodes, 40);
    assert.equal(engine.state.totalPulls, 40);
    // Arms should have non-zero pulls
    const totalPulls = engine.arms.reduce((sum, a) => sum + a.pulls, 0);
    assert.equal(totalPulls, 40);
  });

  it("resets episode state cleanly without clearing estimated Q-values", () => {
    const engine = new SlotMachineEngine();
    engine.trainBatch(20);
    const prevEstimatedQ = engine.arms[2].estimatedQ;

    engine.resetEpisode();
    assert.equal(engine.state.isOver, false);
    assert.equal(engine.arms[2].estimatedQ, prevEstimatedQ);
  });

  it("resets all state, bankroll, and clears Q-values", () => {
    const engine = new SlotMachineEngine();
    engine.trainBatch(20);

    engine.resetAll();
    assert.equal(engine.state.totalPulls, 0);
    assert.equal(engine.state.bankroll, 100);
    for (const arm of engine.arms) {
      assert.equal(arm.pulls, 0);
      assert.equal(arm.estimatedQ, 0);
    }
  });

  it("recovers from bankruptcy on resetEpisode and restores bankroll", () => {
    const engine = new SlotMachineEngine();
    engine.state.bankroll = 0;
    engine.state.isOver = true;

    engine.resetEpisode();
    assert.equal(engine.state.isOver, false);
    assert.equal(engine.state.bankroll, 100);
  });

  it("automatically resets episode when step is called while isOver is true", () => {
    const engine = new SlotMachineEngine();
    engine.state.isOver = true;
    engine.state.bankroll = 0;

    const res = engine.step();
    assert.equal(res.done, true);
    assert.equal(res.reward, 0);
    assert.equal(engine.state.bankroll, 100);
    assert.equal(engine.state.isOver, false);
  });
});
