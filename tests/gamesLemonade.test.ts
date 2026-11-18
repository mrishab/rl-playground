import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LemonadeEngine,
  PREP_ACTIONS,
} from "../src/lib/games/lemonadeEngine.ts";

describe("Dynamic Inventory Management Lemonade Stand Engine", () => {
  it("initializes day 1 with Sunny weather and starting cash balance", () => {
    const engine = new LemonadeEngine();
    assert.equal(engine.state.day, 1);
    assert.equal(engine.state.weather, "Sunny");
    assert.ok(
      ["Sunny", "Cloudy", "Rainy", "Heatwave"].includes(
        engine.state.forecastTomorrow,
      ),
    );
    assert.equal(engine.state.cashBalance, 150);
  });

  it("samples weather demand respecting expected tiers", () => {
    const engine = new LemonadeEngine();
    let rainyTotal = 0;
    let heatwaveTotal = 0;
    for (let i = 0; i < 50; i++) {
      rainyTotal += engine.sampleDemand("Rainy");
      heatwaveTotal += engine.sampleDemand("Heatwave");
    }
    const avgRainy = rainyTotal / 50;
    const avgHeatwave = heatwaveTotal / 50;

    // Rainy demand must be lower than heatwave demand
    assert.ok(avgRainy < 25);
    assert.ok(avgHeatwave > 45);
    assert.ok(avgHeatwave > avgRainy);
  });

  it("computes daily financial economics, spoilage, and stockout penalties", () => {
    const engine = new LemonadeEngine();
    // Prepping 40 cups (action 3)
    const { reward } = engine.step(3);

    assert.equal(engine.state.cupsPrepped, 40);
    assert.ok(engine.state.customerDemand >= 5);
    assert.ok(engine.state.cupsSold <= 40);
    assert.ok(engine.state.cupsSold <= engine.state.customerDemand);
    assert.equal(
      engine.state.cupsSpoiled,
      Math.max(0, 40 - engine.state.customerDemand),
    );
    assert.equal(
      engine.state.customersLost,
      Math.max(0, engine.state.customerDemand - 40),
    );
    assert.ok(typeof reward === "number");
    assert.equal(engine.state.day, 2);
  });

  it("search mode uses static CSP 30-cup fixed plan", () => {
    const engine = new LemonadeEngine();
    engine.setController("search");
    assert.equal(engine.state.controller, "search");

    engine.step();
    // Static CSP selects action index 2 which corresponds to 30 cups
    assert.equal(engine.state.cupsPrepped, PREP_ACTIONS[2]);
  });

  it("trains a batch of seasons, updating Q-table and learned weather policy", () => {
    const engine = new LemonadeEngine();
    const result = engine.trainBatch(10);

    assert.equal(result.episodes, 10);
    assert.ok(engine.qTable.size > 0);
    const policy = engine.state.learnedPolicy;
    assert.ok(typeof policy.Sunny === "number");
    assert.ok(typeof policy.Rainy === "number");
    assert.ok(typeof policy.Heatwave === "number");
  });

  it("resets episode cleanly without losing learned Q-table", () => {
    const engine = new LemonadeEngine();
    engine.trainBatch(5);
    const qCount = engine.qTable.size;
    assert.ok(qCount > 0);

    engine.resetEpisode();
    assert.equal(engine.state.day, 1);
    assert.equal(engine.qTable.size, qCount);
  });

  it("resets all state and clears Q-table", () => {
    const engine = new LemonadeEngine();
    engine.trainBatch(5);
    assert.ok(engine.qTable.size > 0);

    engine.resetAll();
    assert.equal(engine.qTable.size, 0);
    assert.equal(engine.state.day, 1);
  });

  it("automatically resets episode when step is called after season completion", () => {
    const engine = new LemonadeEngine();
    engine.state.day = 31;
    engine.state.isOver = true;
    engine.state.cashBalance = 240;

    const res = engine.step();
    assert.equal(res.done, true);
    assert.equal(res.reward, 0);
    assert.equal(engine.state.day, 1);
    assert.equal(engine.state.isOver, false);
    assert.equal(engine.state.cashBalance, 150);
  });

  it("computes realistic wins and win rate bounded to 100% in batch training", () => {
    const engine = new LemonadeEngine();
    const result = engine.trainBatch(10);
    assert.equal(result.episodes, 10);
    assert.ok(
      result.wins <= 10,
      `Wins should not exceed total episodes: got ${result.wins}`,
    );
    assert.ok(result.wins >= 0);
  });
});
