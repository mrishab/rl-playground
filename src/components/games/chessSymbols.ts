import type { ChessPieceType } from "@/lib/games/types";

export type ChessSymbolKey = `${"w" | "b"}-${ChessPieceType}`;

export const CHESS_SYMBOLS: Record<ChessSymbolKey, string> = {
  "w-K": "♔",
  "w-Q": "♕",
  "w-R": "♖",
  "w-N": "♘",
  "w-P": "♙",
  "b-K": "♚",
  "b-Q": "♛",
  "b-R": "♜",
  "b-N": "♞",
  "b-P": "♟",
};
