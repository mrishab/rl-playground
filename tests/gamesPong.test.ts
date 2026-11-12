import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PongEngine } from "../src/lib/games/pongEngine.ts";

describe("Pong RL Engine", () => {
  it("initializes with correct arena dimensions and paddle positions", () => {
    const engine = new PongEngine();
    assert.equal(engine.width, 240);
    assert.equal(engine.height, 160);
    assert.equal(engine.state.agentScore, 0);
    assert.equal(engine.state.opponentScore, 0);
    assert.ok(engine.state.ballVx !== 0);
  });

  it("produces valid discretized state strings", () => {
    const engine = new PongEngine();
    const key = engine.getStateKey(engine.state);
    assert.match(key, /^[0-4]_[0-2]_[01]_[01]$/);
  });

  it("steps game physics and paddle movement", () => {
    const engine = new PongEngine();
    const initialY = engine.state.agentY;

    // Move Up
    engine.step(1);
    assert.ok(engine.state.agentY <= initialY);

    // Move Down
    engine.step(2);
    assert.ok(engine.state.agentY >= 0);
  });

  it("trains a batch of episodes, updating Q-values and tracking rallies", () => {
    const engine = new PongEngine();
    const result = engine.trainBatch(30);

    assert.equal(result.episodes, 30);
    assert.ok(engine.qTable.size > 0);
    assert.ok(typeof result.avgReward === "number");
  });

  it("resets episode state cleanly without clearing trained Q-table", () => {
    const engine = new PongEngine();
    engine.trainBatch(10);
    const qCount = engine.qTable.size;
    assert.ok(qCount > 0);

    engine.resetEpisode();
    assert.equal(engine.qTable.size, qCount);
    assert.equal(engine.state.ballX, 120);
    assert.equal(engine.state.ballY, 80);
  });

  it("resets all state and clears Q-table when requested", () => {
    const engine = new PongEngine();
    engine.trainBatch(10);
    assert.ok(engine.qTable.size > 0);

    engine.resetAll();
    assert.equal(engine.qTable.size, 0);
    assert.equal(engine.state.agentScore, 0);
  });
});
