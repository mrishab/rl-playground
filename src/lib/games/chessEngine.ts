import type {
  ChessMove,
  ChessPiece,
  ChessPieceColor,
  ChessPieceType,
  ChessState,
  ControllerMode,
  GameHyperparameters,
} from "./types";

export const PIECE_VALUES: Record<ChessPieceType, number> = {
  P: 10,
  N: 30,
  B: 30,
  R: 50,
  Q: 90,
  K: 1000,
};

export class ChessEngine {
  state: ChessState;
  qTable: Map<string, number[]> = new Map();
  hyperparams: GameHyperparameters;
  controller: ControllerMode = "rl";

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.2,
      discountFactor: 0.95,
      explorationRate: 0.15,
      epsilonDecay: 0.996,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  createInitialState(): ChessState {
    const board: (ChessPiece | null)[][] = Array(4)
      .fill(null)
      .map(() => Array(4).fill(null));

    // Row 0: Black pieces
    board[0][0] = { type: "R", color: "b" };
    board[0][1] = { type: "K", color: "b" };
    board[0][2] = { type: "N", color: "b" };
    board[0][3] = { type: "R", color: "b" };

    // Row 1: Black pawns
    board[1][1] = { type: "P", color: "b" };
    board[1][2] = { type: "P", color: "b" };

    // Row 2: White pawns
    board[2][1] = { type: "P", color: "w" };
    board[2][2] = { type: "P", color: "w" };

    // Row 3: White pieces
    board[3][0] = { type: "R", color: "w" };
    board[3][1] = { type: "K", color: "w" };
    board[3][2] = { type: "N", color: "w" };
    board[3][3] = { type: "R", color: "w" };

    return {
      board,
      turn: "w",
      moveCount: 0,
      isOver: false,
      winner: null,
      lastMove: null,
      agentCaptures: [],
      opponentCaptures: [],
      lastReward: 0,
    };
  }

  setController(controller: ControllerMode): void {
    this.controller = controller;
  }

  resetEpisode(): void {
    this.state = this.createInitialState();
  }

  resetAll(): void {
    const prevController = this.controller;
    this.qTable.clear();
    this.state = this.createInitialState();
    this.controller = prevController;
  }

  getLegalMoves(color: ChessPieceColor, board = this.state.board): ChessMove[] {
    const moves: ChessMove[] = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const piece = board[r][c];
        if (!piece || piece.color !== color) continue;

        switch (piece.type) {
          case "K": {
            const deltas = [
              [-1, -1],
              [-1, 0],
              [-1, 1],
              [0, -1],
              [0, 1],
              [1, -1],
              [1, 0],
              [1, 1],
            ];
            for (const [dr, dc] of deltas) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const target = board[nr][nc];
                if (!target || target.color !== color) {
                  moves.push({
                    from: [r, c],
                    to: [nr, nc],
                    piece,
                    captured: target || undefined,
                  });
                }
              }
            }
            break;
          }
          case "N": {
            const jumps = [
              [-2, -1],
              [-2, 1],
              [-1, -2],
              [-1, 2],
              [1, -2],
              [1, 2],
              [2, -1],
              [2, 1],
            ];
            for (const [dr, dc] of jumps) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const target = board[nr][nc];
                if (!target || target.color !== color) {
                  moves.push({
                    from: [r, c],
                    to: [nr, nc],
                    piece,
                    captured: target || undefined,
                  });
                }
              }
            }
            break;
          }
          case "R": {
            const dirs = [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ];
            for (const [dr, dc] of dirs) {
              let nr = r + dr;
              let nc = c + dc;
              while (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const target = board[nr][nc];
                if (!target) {
                  moves.push({ from: [r, c], to: [nr, nc], piece });
                } else {
                  if (target.color !== color) {
                    moves.push({
                      from: [r, c],
                      to: [nr, nc],
                      piece,
                      captured: target,
                    });
                  }
                  break; // blocked
                }
                nr += dr;
                nc += dc;
              }
            }
            break;
          }
          case "Q": {
            const dirs = [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
            ];
            for (const [dr, dc] of dirs) {
              let nr = r + dr;
              let nc = c + dc;
              while (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const target = board[nr][nc];
                if (!target) {
                  moves.push({ from: [r, c], to: [nr, nc], piece });
                } else {
                  if (target.color !== color) {
                    moves.push({
                      from: [r, c],
                      to: [nr, nc],
                      piece,
                      captured: target,
                    });
                  }
                  break;
                }
                nr += dr;
                nc += dc;
              }
            }
            break;
          }
          case "P": {
            const fwd = color === "w" ? -1 : 1;
            const nr = r + fwd;
            // Move forward
            if (nr >= 0 && nr < 4 && !board[nr][c]) {
              moves.push({ from: [r, c], to: [nr, c], piece });
            }
            // Captures
            for (const dc of [-1, 1]) {
              const nc = c + dc;
              if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const target = board[nr][nc];
                if (target && target.color !== color) {
                  moves.push({
                    from: [r, c],
                    to: [nr, nc],
                    piece,
                    captured: target,
                  });
                }
              }
            }
            break;
          }
        }
      }
    }

    return moves;
  }

  isSquareAttacked(
    r: number,
    c: number,
    byColor: ChessPieceColor,
    board = this.state.board,
  ): boolean {
    const oppMoves = this.getLegalMoves(byColor, board);
    if (
      oppMoves.some(
        (m) => m.piece.type !== "P" && m.to[0] === r && m.to[1] === c,
      )
    ) {
      return true;
    }
    const fwd = byColor === "w" ? -1 : 1;
    for (let pr = 0; pr < 4; pr++) {
      for (let pc = 0; pc < 4; pc++) {
        const piece = board[pr][pc];
        if (piece && piece.color === byColor && piece.type === "P") {
          if (r === pr + fwd && (c === pc - 1 || c === pc + 1)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  classifyMove(move: ChessMove): number {
    if (move.captured?.type === "K") return 0; // King capture
    if (move.captured?.type === "Q" || move.captured?.type === "R") return 1; // Major piece
    if (move.captured?.type === "N") return 2; // Knight
    if (move.captured?.type === "P") return 3; // Pawn

    // Pawn Promotion
    if (move.piece.type === "P" && move.to[0] === 0) return 4;

    // Evade threatened piece
    const isAttacked = this.isSquareAttacked(
      move.from[0],
      move.from[1],
      "b",
      this.state.board,
    );
    if (isAttacked) return 5;

    // Knight jump
    if (move.piece.type === "N") return 6;

    // Rook file move
    if (move.piece.type === "R") return 7;

    // King move
    if (move.piece.type === "K") return 8;

    return 9; // Positional
  }

  getStateKey(state: ChessState): string {
    let whiteMat = 0;
    let blackMat = 0;
    let highestThreatOnWhite = 0;
    let highestHangingBlack = 0;
    let whiteKingThreatened = 0;
    let blackKingThreatened = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const p = state.board[r][c];
        if (!p) continue;

        if (p.color === "w") {
          whiteMat += PIECE_VALUES[p.type];
          if (this.isSquareAttacked(r, c, "b", state.board)) {
            if (p.type === "K") whiteKingThreatened = 1;
            highestThreatOnWhite = Math.max(
              highestThreatOnWhite,
              PIECE_VALUES[p.type] / 10,
            );
          }
        } else {
          blackMat += PIECE_VALUES[p.type];
          if (this.isSquareAttacked(r, c, "w", state.board)) {
            if (p.type === "K") blackKingThreatened = 1;
            highestHangingBlack = Math.max(
              highestHangingBlack,
              PIECE_VALUES[p.type] / 10,
            );
          }
        }
      }
    }

    const matDiff = whiteMat - blackMat;
    let matBin = 2; // equal
    if (matDiff < -40) matBin = 0;
    else if (matDiff < -10) matBin = 1;
    else if (matDiff > 40) matBin = 4;
    else if (matDiff > 10) matBin = 3;

    return `${matBin}_${whiteKingThreatened}_${blackKingThreatened}_${Math.min(5, Math.floor(highestThreatOnWhite))}_${Math.min(5, Math.floor(highestHangingBlack))}`;
  }

  getQValues(stateKey: string): number[] {
    let q = this.qTable.get(stateKey);
    if (!q) {
      q = Array(10).fill(0);
      this.qTable.set(stateKey, q);
    }
    return q;
  }

  selectAgentMove(legalMoves: ChessMove[], explore = true): ChessMove {
    if (legalMoves.length === 0) throw new Error("No legal moves");

    const stateKey = this.getStateKey(this.state);
    const q = this.getQValues(stateKey);

    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const bestMoves: ChessMove[] = [];
    let maxVal = -Infinity;

    for (const m of legalMoves) {
      const cat = this.classifyMove(m);
      const val = q[cat];
      if (val > maxVal) {
        maxVal = val;
        bestMoves.length = 0;
        bestMoves.push(m);
      } else if (val === maxVal) {
        bestMoves.push(m);
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  selectSearchMove(legalMoves: ChessMove[]): ChessMove {
    if (legalMoves.length === 0) throw new Error("No legal moves");

    // Static minimax heuristic: maximize immediate material capture and positional advance
    let best = legalMoves[0];
    let bestScore = -9999;

    for (const m of legalMoves) {
      let score = 0;
      if (m.captured) {
        score += PIECE_VALUES[m.captured.type] * 3;
      }
      if (m.piece.type === "P") score += (3 - m.to[0]) * 3;
      if (m.piece.type === "N") score += 2;
      if (this.isSquareAttacked(m.to[0], m.to[1], "b")) {
        score -= PIECE_VALUES[m.piece.type];
      }
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
    }
    return best;
  }

  applyMove(move: ChessMove): void {
    const { from, to, piece } = move;
    this.state.board[from[0]][from[1]] = null;

    // Promotion check
    if (piece.type === "P" && (to[0] === 0 || to[0] === 3)) {
      this.state.board[to[0]][to[1]] = { type: "Q", color: piece.color };
    } else {
      this.state.board[to[0]][to[1]] = piece;
    }

    this.state.lastMove = move;
    this.state.moveCount++;
  }

  selectOpponentMove(): ChessMove | null {
    const oppMoves = this.getLegalMoves("b");
    if (oppMoves.length === 0) return null;

    // Greedy heuristic AI
    let best = oppMoves[0];
    let bestScore = -9999;

    for (const m of oppMoves) {
      let score = 0;
      if (m.captured) {
        score += PIECE_VALUES[m.captured.type] * 2;
      }
      // Prefer advancing pawns
      if (m.piece.type === "P") score += m.to[0] * 3;
      // Prefer developing Knight
      if (m.piece.type === "N") score += 2;

      // Penalize moving into an attacked square
      if (this.isSquareAttacked(m.to[0], m.to[1], "w")) {
        score -= PIECE_VALUES[m.piece.type];
      }

      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
    }

    return best;
  }

  step(): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    const whiteMoves = this.getLegalMoves("w");
    if (whiteMoves.length === 0) {
      // Stalemate or loss
      s.isOver = true;
      s.winner = "b";
      s.lastReward = -30.0;
      return { reward: -30.0, done: true };
    }

    const stateKey = this.getStateKey(s);
    const chosenMove =
      this.controller === "search"
        ? this.selectSearchMove(whiteMoves)
        : this.selectAgentMove(whiteMoves, true);
    const actionCat = this.classifyMove(chosenMove);

    // Apply White move
    if (chosenMove.captured) {
      s.agentCaptures.push(chosenMove.captured.type);
    }
    this.applyMove(chosenMove);

    let reward = -0.05; // tiny step move cost
    let done = false;

    // Immediate check if White captured Black King
    if (chosenMove.captured?.type === "K") {
      s.isOver = true;
      s.winner = "w";
      reward += 50.0;
      done = true;
    } else if (chosenMove.captured) {
      reward += PIECE_VALUES[chosenMove.captured.type] * 0.4;
    }

    // Black's turn if game not over
    if (!done) {
      const oppMove = this.selectOpponentMove();
      if (!oppMove) {
        // Black has no moves -> White wins
        s.isOver = true;
        s.winner = "w";
        reward += 40.0;
        done = true;
      } else {
        if (oppMove.captured) {
          s.opponentCaptures.push(oppMove.captured.type);
          reward -= PIECE_VALUES[oppMove.captured.type] * 0.4;
        }
        this.applyMove(oppMove);

        if (oppMove.captured?.type === "K") {
          // White King captured! Loss
          s.isOver = true;
          s.winner = "b";
          reward -= 50.0;
          done = true;
        }
      }
    }

    // Turn limit check
    if (s.moveCount >= 50 && !done) {
      s.isOver = true;
      s.winner = "draw";
      done = true;
    }

    s.lastReward = reward;

    if (this.controller === "rl") {
      // RL Q-update
      const nextStateKey = this.getStateKey(s);
      const qCurrent = this.getQValues(stateKey);
      const nextQ = this.getQValues(nextStateKey);

      const target = done
        ? reward
        : reward + this.hyperparams.discountFactor * Math.max(...nextQ);

      qCurrent[actionCat] +=
        this.hyperparams.learningRate * (target - qCurrent[actionCat]);
    }

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    losses: number;
    draws: number;
    avgReward: number;
  } {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalReward = 0;

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let epReward = 0;

      while (!this.state.isOver) {
        const { reward, done } = this.step();
        epReward += reward;
        if (done) break;
      }

      if (this.state.winner === "w") wins++;
      else if (this.state.winner === "b") losses++;
      else draws++;

      totalReward += epReward;

      this.hyperparams.explorationRate = Math.max(
        0.03,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    return {
      episodes,
      wins,
      losses,
      draws,
      avgReward: totalReward / episodes,
    };
  }
}
