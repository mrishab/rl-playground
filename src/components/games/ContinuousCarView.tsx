import type { ContinuousCarState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { ContinuousCarTrack } from "./ContinuousCarTrack";
import { ContinuousCarTelemetry } from "./ContinuousCarTelemetry";
import { ContinuousCarControls } from "./ContinuousCarControls";

type Props = {
  state: ContinuousCarState;
};

export function ContinuousCarView({ state }: Props) {
  const setErrorRate = useGamesStore((s) => s.setContinuousCarVillainErrorRate);
  const onBoost = useGamesStore((s) => s.triggerContinuousCarBoost);

  const failureNotice =
    state.isCollided && state.controller === "search"
      ? "Discrete Search Oscillation Crash"
      : null;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner
        gameId="continuous-car"
        controller={state.controller}
        failureNotice={failureNotice}
      />
      <div className="relative w-full max-w-[380px] mx-auto rounded-lg overflow-hidden border border-border bg-neutral-950 p-2 shadow-inner space-y-2">
        <div className="w-full aspect-[320/200]">
          <ContinuousCarTrack state={state} />
        </div>
        <ContinuousCarControls
          state={state}
          onErrorRateChange={setErrorRate}
          onBoost={onBoost}
        />
        <ContinuousCarTelemetry state={state} />
      </div>
    </div>
  );
}
