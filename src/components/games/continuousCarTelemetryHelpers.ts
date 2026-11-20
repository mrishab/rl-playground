import type { ContinuousCarState } from "@/lib/games/types";

export function getContinuousCarStatus(state: ContinuousCarState) {
  const steerDeg = Math.round((state.steering * 180) / Math.PI);
  const steerText =
    steerDeg > 0
      ? `+${steerDeg}° R`
      : steerDeg < 0
        ? `${steerDeg}° L`
        : "0° Center";
  const posBadge =
    state.racePosition === 1
      ? "🥇 1st"
      : state.racePosition === 2
        ? "🥈 2nd"
        : "🥉 3rd";
  const isWon =
    state.isOver &&
    state.racePosition === 1 &&
    state.lapCount >= state.targetLaps;
  const statusText = state.isCollided
    ? "CRASH!"
    : isWon
      ? "VICTORY!"
      : state.isOver
        ? "OVER"
        : state.isSkidding
          ? "SKIDDING!"
          : steerText;
  const statusClass = state.isCollided
    ? "text-destructive font-bold"
    : isWon
      ? "text-success font-bold"
      : state.isSkidding
        ? "text-warning font-bold animate-pulse"
        : "text-warning";

  return { posBadge, statusText, statusClass };
}

export function getContinuousCarNotice(state: ContinuousCarState): string {
  const isRecentBump =
    state.lastBump && Date.now() - state.lastBump.timestamp < 2500;
  if (isRecentBump) return state.lastBump!.description;
  if (
    state.isOver &&
    state.racePosition === 1 &&
    state.lapCount >= state.targetLaps
  ) {
    return "Race Won!";
  }
  return state.isOver ? "Race Over" : "Racing Active";
}
