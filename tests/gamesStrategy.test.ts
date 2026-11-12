import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  StrategyEngine,
  STRATEGY_GRID_SIZE,
} from "../src/lib/games/strategyEngine.ts";

describe("Tactical Grid Strategy RL Engine", () => {
  it("initializes 6x6 grid, nodes, obstacles, and competing units", () => {
    const engine = new StrategyEngine();
    assert.equal(STRATEGY_GRID_SIZE, 6);
    assert.equal(engine.gridSize, 6);
    assert.equal(engine.state.agent.row, 5);
    assert.equal(engine.state.agent.col, 0);
    assert.equal(engine.state.opponent.row, 0);
    assert.equal(engine.state.opponent.col, 5);
    assert.equal(engine.state.agent.health, 100);
    assert.equal(engine.state.opponent.health, 100);
    assert.equal(engine.state.nodes.length, 3);
    assert.equal(engine.state.obstacles.length, 4);
    assert.equal(engine.state.turn, 0);
  });

  it("produces valid state key representation", () => {
    const engine = new StrategyEngine();
    const key = engine.getStateKey(engine.state);
    assert.ok(typeof key === "string");
    const parts = key.split("_");
    assert.equal(parts.length, 9);
  });

  it("handles movement and prevents passing through tactical obstacles", () => {
    const engine = new StrategyEngine();
    // Move agent UP (action 0) from (5, 0) -> (4, 0)
    const { reward } = engine.step(0);
    assert.equal(engine.state.agent.row, 4);
    assert.equal(engine.state.agent.col, 0);
    assert.ok(typeof reward === "number");

    // Attempting to step into obstacle at (4, 1) -> action 1 (RIGHT)
    engine.step(1);
    // Should be blocked and stay at (4, 0)
    assert.equal(engine.state.agent.row, 4);
    assert.equal(engine.state.agent.col, 0);
  });

  it("captures tactical nodes and accumulates score", () => {
    const engine = new StrategyEngine();
    // Teleport agent directly onto node-bravo at (3, 1)
    engine.state.agent.row = 3;
    engine.state.agent.col = 1;

    // Action 4 is CAPTURE
    const { reward } = engine.step(4);
    const node = engine.state.nodes.find((n) => n.id === "node-bravo");
    assert.equal(node?.owner, "agent");
    assert.ok(reward > 5);
    assert.ok(engine.state.score >= 25);
  });

  it("attacks adjacent opponent and handles combat damage", () => {
    const engine = new StrategyEngine();
    // Teleport agent adjacent to opponent (0, 4) vs opponent at (0, 5)
    engine.state.agent.row = 0;
    engine.state.agent.col = 4;

    const initialOppHp = engine.state.opponent.health;
    // Action 5 is ATTACK
    engine.step(5);
    assert.ok(engine.state.opponent.health < initialOppHp);
  });

  it("trains a batch of tactical episodes and updates Q-table", () => {
    const engine = new StrategyEngine();
    const result = engine.trainBatch(15);

    assert.equal(result.episodes, 15);
    assert.ok(result.wins + result.losses + result.draws === 15);
    assert.ok(engine.qTable.size > 0);
    assert.ok(typeof result.avgReward === "number");
  });

  it("resets episode state cleanly without losing trained Q-table", () => {
    const engine = new StrategyEngine();
    engine.trainBatch(5);
    const qCount = engine.qTable.size;
    assert.ok(qCount > 0);

    engine.resetEpisode();
    assert.equal(engine.qTable.size, qCount);
    assert.equal(engine.state.agent.row, 5);
    assert.equal(engine.state.agent.col, 0);
  });

  it("resets all state and clears Q-table", () => {
    const engine = new StrategyEngine();
    engine.trainBatch(5);
    assert.ok(engine.qTable.size > 0);

    engine.resetAll();
    assert.equal(engine.qTable.size, 0);
    assert.equal(engine.state.turn, 0);
  });

  it("resolves turn limit correctly for symmetric HP advantages and draws", () => {
    // Case 1: Equal nodes, Opponent has higher HP -> Opponent wins
    const engine1 = new StrategyEngine();
    engine1.state.turn = 59;
    engine1.state.nodes[0].owner = "agent";
    engine1.state.nodes[1].owner = "opponent";
    engine1.state.agent.health = 40;
    engine1.state.opponent.health = 80;
    // Keep units apart so opponent doesn't attack
    engine1.state.agent.row = 5;
    engine1.state.agent.col = 0;
    engine1.state.opponent.row = 0;
    engine1.state.opponent.col = 5;

    engine1.step(0);
    assert.equal(engine1.state.isOver, true);
    assert.equal(engine1.state.winner, "opponent");

    // Case 2: Equal nodes, Agent has higher HP -> Agent wins
    const engine2 = new StrategyEngine();
    engine2.state.turn = 59;
    engine2.state.nodes[0].owner = "agent";
    engine2.state.nodes[1].owner = "opponent";
    engine2.state.agent.health = 90;
    engine2.state.opponent.health = 30;
    engine2.state.agent.row = 5;
    engine2.state.agent.col = 0;
    engine2.state.opponent.row = 0;
    engine2.state.opponent.col = 5;

    engine2.step(0);
    assert.equal(engine2.state.isOver, true);
    assert.equal(engine2.state.winner, "agent");

    // Case 3: Equal nodes, Equal HP -> Draw
    const engine3 = new StrategyEngine();
    engine3.state.turn = 59;
    engine3.state.nodes[0].owner = "agent";
    engine3.state.nodes[1].owner = "opponent";
    engine3.state.agent.health = 70;
    engine3.state.opponent.health = 70;
    engine3.state.agent.row = 5;
    engine3.state.agent.col = 0;
    engine3.state.opponent.row = 0;
    engine3.state.opponent.col = 5;

    engine3.step(0);
    assert.equal(engine3.state.isOver, true);
    assert.equal(engine3.state.winner, "draw");
  });

  it("breaks ties among maximizing actions uniformly at random", () => {
    const engine = new StrategyEngine({ explorationRate: 0 });
    const counts = new Array(6).fill(0);
    const key = engine.getStateKey(engine.state);

    // Call selectAction 100 times on fresh state
    for (let i = 0; i < 100; i++) {
      const act = engine.selectAction(key, false);
      counts[act]++;
    }

    // Should not all be action 0 (multiple actions chosen)
    const distinctActions = counts.filter((c) => c > 0).length;
    assert.ok(distinctActions > 1, `Expected multiple actions, got: ${counts}`);
  });
});
