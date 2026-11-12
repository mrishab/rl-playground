import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PacmanEngine,
  PACMAN_GRID_SIZE,
} from "../src/lib/games/pacmanEngine.ts";

describe("Pac-Man RL Maze Engine", () => {
  it("initializes maze layout, pellets, energizers, and entities", () => {
    const engine = new PacmanEngine();
    assert.equal(PACMAN_GRID_SIZE, 9);
    assert.equal(engine.state.pacman.row, 6);
    assert.equal(engine.state.pacman.col, 4);
    assert.equal(engine.state.ghosts.length, 2);
    assert.equal(engine.state.powerPellets.size, 4);
    assert.ok(engine.state.pellets.size > 20);
    assert.equal(engine.state.frightenedTimer, 0);
  });

  it("produces valid spatial state keys", () => {
    const engine = new PacmanEngine();
    const key = engine.getStateKey(engine.state);
    assert.ok(key.length > 5);
    const parts = key.split("_");
    assert.equal(parts.length, 8);
  });

  it("handles valid moves and eats pellets", () => {
    const engine = new PacmanEngine();
    const initialPellets = engine.state.pelletsRemaining;
    const initialScore = engine.state.score;

    // Legal moves from (6, 4) in default maze
    const moves = engine.getLegalMoves(6, 4);
    assert.ok(moves.length > 0);

    // Step with agent
    const { reward } = engine.step();
    assert.ok(typeof reward === "number");
    assert.ok(engine.state.score >= initialScore);
    assert.ok(engine.state.pelletsRemaining <= initialPellets);
  });

  it("activates frightened mode when power pellet is eaten", () => {
    const engine = new PacmanEngine();
    // Teleport Pac-Man next to power pellet at (1, 1)
    engine.state.pacman = { row: 1, col: 2 };
    // Move left to (1, 1) -> action 3 (LEFT)
    engine.step(3);

    assert.equal(engine.state.pacman.row, 1);
    assert.equal(engine.state.pacman.col, 1);
    assert.ok(engine.state.frightenedTimer > 0);
    for (const g of engine.state.ghosts) {
      assert.equal(g.isFrightened, true);
    }
  });

  it("trains a batch of episodes, updating Q-table and clearing pellets", () => {
    const engine = new PacmanEngine();
    const result = engine.trainBatch(20);

    assert.equal(result.episodes, 20);
    assert.ok(engine.qTable.size > 0);
    assert.ok(typeof result.avgReward === "number");
  });

  it("resets all cleanly", () => {
    const engine = new PacmanEngine();
    engine.trainBatch(5);
    assert.ok(engine.qTable.size > 0);

    engine.resetAll();
    assert.equal(engine.qTable.size, 0);
    assert.equal(engine.state.score, 0);
    assert.equal(engine.state.pacman.row, 6);
    assert.equal(engine.state.pacman.col, 4);
  });
});
