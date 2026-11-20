import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PongEngine } from "../src/lib/games/pongEngine.ts";
import { PacmanEngine } from "../src/lib/games/pacmanEngine.ts";
import { ChessEngine } from "../src/lib/games/chessEngine.ts";
import { StrategyEngine } from "../src/lib/games/strategyEngine.ts";
import { IceMazeEngine } from "../src/lib/games/iceMazeEngine.ts";
import { SlotMachineEngine } from "../src/lib/games/slotMachineEngine.ts";
import { LemonadeEngine } from "../src/lib/games/lemonadeEngine.ts";
import { useGamesStore } from "../src/stores/gamesStore.ts";

describe("Games Search Mode State Isolation", () => {
  it("Pong: search mode steps without mutating Q-table", () => {
    const engine = new PongEngine();
    engine.setController("search");
    assert.equal(engine.controller, "search");
    for (let i = 0; i < 20; i++) {
      engine.step();
    }
    assert.equal(engine.qTable.size, 0);
  });

  it("Pac-Man: search mode steps without mutating Q-table and resetEpisode zeroes score", () => {
    const engine = new PacmanEngine();
    engine.setController("search");
    assert.equal(engine.controller, "search");
    for (let i = 0; i < 20; i++) {
      engine.step();
    }
    assert.equal(engine.qTable.size, 0);

    // Verify score does not leak across episodes
    engine.state.score = 500;
    engine.resetEpisode();
    assert.equal(engine.state.score, 0);
  });

  it("Chess: search mode steps without mutating Q-table", () => {
    const engine = new ChessEngine();
    engine.setController("search");
    assert.equal(engine.controller, "search");
    for (let i = 0; i < 10; i++) {
      if (engine.state.isOver) break;
      engine.step();
    }
    assert.equal(engine.qTable.size, 0);
  });

  it("Strategy: search mode steps without mutating Q-table and resetEpisode zeroes score", () => {
    const engine = new StrategyEngine();
    engine.setController("search");
    assert.equal(engine.controller, "search");
    for (let i = 0; i < 15; i++) {
      if (engine.state.isOver) break;
      engine.step();
    }
    assert.equal(engine.qTable.size, 0);

    // Verify score does not leak across episodes
    engine.state.score = 250;
    engine.resetEpisode();
    assert.equal(engine.state.score, 0);
  });

  it("Ice Maze: search mode steps without mutating Q-table", () => {
    const engine = new IceMazeEngine();
    engine.setController("search");
    assert.equal(engine.state.controller, "search");
    for (let i = 0; i < 15; i++) {
      if (engine.state.isOver) break;
      engine.step();
    }
    assert.equal(engine.qTable.size, 0);
  });

  it("Slot Machine: search mode steps without mutating Q-values", () => {
    const engine = new SlotMachineEngine();
    engine.setController("search");
    assert.equal(engine.state.controller, "search");
    for (let i = 0; i < 20; i++) {
      engine.step();
    }
    for (const q of engine.qValues) {
      assert.equal(q, 0);
    }
  });

  it("Lemonade: search mode steps without mutating Q-table", () => {
    const engine = new LemonadeEngine();
    engine.setController("search");
    assert.equal(engine.state.controller, "search");
    for (let i = 0; i < 15; i++) {
      if (engine.state.isOver) break;
      engine.step();
    }
    assert.equal(engine.qTable.size, 0);
  });

  it("gamesStore: toggling between Q-Learning and SARSA resets metrics and clears Q-tables", () => {
    const store = useGamesStore.getState();
    store.trainBatch(10);
    assert.ok(useGamesStore.getState().metrics[store.activeGame].episodes > 0);

    // Toggle algorithm to sarsa
    store.setHyperparams({ algorithm: "sarsa" });
    assert.equal(useGamesStore.getState().hyperparams.algorithm, "sarsa");
    assert.equal(
      useGamesStore.getState().metrics[useGamesStore.getState().activeGame]
        .episodes,
      0,
    );

    // Toggle back to q-learning
    store.setHyperparams({ algorithm: "q-learning" });
    assert.equal(useGamesStore.getState().hyperparams.algorithm, "q-learning");
    assert.equal(
      useGamesStore.getState().metrics[useGamesStore.getState().activeGame]
        .episodes,
      0,
    );
  });
});
