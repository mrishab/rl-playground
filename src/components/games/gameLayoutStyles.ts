import { cn } from "@/lib/utils";

export const GAME_CARD_SQUARE = cn(
  "relative w-full aspect-square max-w-[340px] mx-auto",
  "rounded-lg overflow-hidden border border-border bg-card p-2 shadow-inner",
);

export const GAME_CARD_FLEX_COL = cn(
  "relative w-full aspect-square max-w-[340px] mx-auto",
  "rounded-lg overflow-hidden border border-border bg-card p-2.5 shadow-inner",
  "flex flex-col justify-between",
);

export const PONG_CARD_CONTAINER = cn(
  "relative w-full aspect-[3/2] max-w-xl mx-auto rounded-lg overflow-hidden",
  "border border-border bg-card shadow-inner flex items-center justify-center",
);

export const CAR_CARD_CONTAINER = cn(
  "relative w-full max-w-[380px] mx-auto rounded-lg overflow-hidden",
  "border border-border bg-card p-2 shadow-inner space-y-2",
);
