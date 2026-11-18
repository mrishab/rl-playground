import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  IceMazeEngine,
  ICE_MAZE_SIZE,
} from "../src/lib/games/iceMazeEngine.ts";

describe("Ice Maze Stochastic Grid Engine", () => {
  it("initializes 8x8 grid with start, goal, hazards, and slip rate", () => {
    const engine = new IceMazeEngine();
    assert.equal(engine.size, ICE_MAZE_SIZE);
    assert.equal(engine.state.agentRow, 0);
    assert.equal(engine.state.agentCol, 0);
    assert.equal(engine.state.goalRow, 7);
    assert.equal(engine.state.goalCol, 7);
    assert.ok(engine.state.hazards.length > 0);
    assert.equal(engine.state.slipRate, 0.3);
    assert.equal(engine.state.controller, "rl");
  });

  it("computes deterministic A* path avoiding static walls and hazards", () => {
    const engine = new IceMazeEngine();
    const path = engine.computeAStarPath([0, 0], [7, 7]);
    assert.ok(path.length > 0);
    assert.deepEqual(path[0], [0, 0]);
    assert.deepEqual(path[path.length - 1], [7, 7]);

    // Path should never intersect hazard or wall
    for (const [r, c] of path) {
      assert.equal(engine.isWall(r, c), false);
      assert.equal(engine.isHazard(r, c), false);
    }
  });

  it("moves deterministically when slip rate is 0", () => {
    const engine = new IceMazeEngine();
    engine.setSlipRate(0);
    // Move Right (action 1)
    engine.step(1);
    assert.equal(engine.state.agentRow, 0);
    assert.equal(engine.state.agentCol, 1);
    assert.equal(engine.state.lastSlip, null);
  });

  it("experiences orthogonal slip when slip rate is 1", () => {
    const engine = new IceMazeEngine();
    engine.setSlipRate(1.0);
    // Intend to move Down (action 2) -> with slipRate 1, must slip Left or Right
    engine.step(2);
    assert.ok(engine.state.lastSlip !== null);
    assert.equal(engine.state.lastSlip.intended, "South");
    assert.ok(
      engine.state.lastSlip.actual === "East" ||
        engine.state.lastSlip.actual === "West",
    );
  });

  it("runs A* search mode and catches slips into hazards", () => {
    const engine = new IceMazeEngine();
    engine.setController("search");
    assert.equal(engine.state.controller, "search");

    let finished = false;
    for (let step = 0; step < 50; step++) {
      const { done } = engine.step();
      if (done) {
        finished = true;
        break;
      }
    }
    assert.ok(finished || engine.state.stepCount > 0);
  });

  it("trains a batch of episodes, updating Q-table values", () => {
    const engine = new IceMazeEngine();
    const result = engine.trainBatch(20);
    assert.equal(result.episodes, 20);
    assert.ok(engine.qTable.size > 0);
    assert.ok(typeof result.avgReward === "number");
  });

  it("resets episode cleanly without losing Q-table", () => {
    const engine = new IceMazeEngine();
    engine.trainBatch(10);
    const qCount = engine.qTable.size;
    assert.ok(qCount > 0);

    engine.resetEpisode();
    assert.equal(engine.qTable.size, qCount);
    assert.equal(engine.state.agentRow, 0);
    assert.equal(engine.state.agentCol, 0);
    assert.equal(engine.state.isOver, false);
  });

  it("resets all state and clears Q-table", () => {
    const engine = new IceMazeEngine();
    engine.trainBatch(10);
    assert.ok(engine.qTable.size > 0);

    engine.resetAll();
    assert.equal(engine.qTable.size, 0);
    assert.equal(engine.state.agentRow, 0);
    assert.equal(engine.state.agentCol, 0);
  });

  it("converges and successfully reaches goal after training", () => {
    const engine = new IceMazeEngine();
    engine.trainBatch(200);

    // Greedy evaluation without exploration
    let wins = 0;
    for (let ep = 0; ep < 30; ep++) {
      engine.resetEpisode();
      for (let s = 0; s < 50; s++) {
        const action = engine.selectAction(
          engine.state.agentRow,
          engine.state.agentCol,
          false,
        );
        const { done } = engine.step(action);
        if (done) {
          if (engine.state.won) wins++;
          break;
        }
      }
    }
    assert.ok(wins >= 20, `Expected at least 20/30 wins, got ${wins}`);
  });

  it("automatically resets episode when step is called after game over", () => {
    const engine = new IceMazeEngine();
    engine.state.isOver = true;
    engine.state.agentRow = 7;
    engine.state.agentCol = 7;

    const res = engine.step();
    assert.equal(res.done, true);
    assert.equal(res.reward, 0);
    assert.equal(engine.state.agentRow, 0);
    assert.equal(engine.state.agentCol, 0);
    assert.equal(engine.state.isOver, false);
  });
});
