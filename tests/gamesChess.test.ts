import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ChessEngine } from "../src/lib/games/chessEngine.ts";

describe("Tactical Chess RL Engine", () => {
  it("initializes 4x4 micro-board with pieces", () => {
    const engine = new ChessEngine();
    assert.equal(engine.state.board.length, 4);
    assert.equal(engine.state.board[0].length, 4);

    // Black King at (0, 1)
    assert.equal(engine.state.board[0][1]?.type, "K");
    assert.equal(engine.state.board[0][1]?.color, "b");

    // White King at (3, 1)
    assert.equal(engine.state.board[3][1]?.type, "K");
    assert.equal(engine.state.board[3][1]?.color, "w");

    // White Pawns at row 2
    assert.equal(engine.state.board[2][1]?.type, "P");
    assert.equal(engine.state.board[2][2]?.type, "P");
  });

  it("calculates legal moves for white pieces correctly", () => {
    const engine = new ChessEngine();
    const whiteMoves = engine.getLegalMoves("w");
    assert.ok(whiteMoves.length > 0);

    // Pawn can move forward to (1, 1) and (1, 2)
    const pawnMoves = whiteMoves.filter((m) => m.piece.type === "P");
    assert.ok(pawnMoves.length >= 2);

    // Knight can jump
    const knightMoves = whiteMoves.filter((m) => m.piece.type === "N");
    assert.ok(knightMoves.length > 0);
  });

  it("detects attacked squares correctly", () => {
    const engine = new ChessEngine();
    // Square (1, 1) is not attacked by White initially, but (1, 0) or (1, 2) is attacked by pawn
    const attacked = engine.isSquareAttacked(1, 0, "w");
    // White pawn at (2, 1) attacks (1, 0) diagonally!
    assert.equal(attacked, true);
  });

  it("executes full adversarial step (White RL agent + Black AI)", () => {
    const engine = new ChessEngine();
    const initialMoveCount = engine.state.moveCount;

    const { reward, done } = engine.step();
    assert.ok(typeof reward === "number");
    assert.ok(typeof done === "boolean");
    assert.ok(engine.state.moveCount > initialMoveCount);
  });

  it("trains a batch of tactical chess episodes and updates Q-table", () => {
    const engine = new ChessEngine();
    const result = engine.trainBatch(15);

    assert.equal(result.episodes, 15);
    assert.ok(result.wins + result.losses + result.draws === 15);
    assert.ok(engine.qTable.size > 0);
  });

  it("resets all chess state cleanly", () => {
    const engine = new ChessEngine();
    engine.trainBatch(5);
    assert.ok(engine.qTable.size > 0);

    engine.resetAll();
    assert.equal(engine.qTable.size, 0);
    assert.equal(engine.state.moveCount, 0);
    assert.equal(engine.state.winner, null);
  });
});
