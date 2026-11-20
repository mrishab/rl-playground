import type { ContinuousCarState } from "@/lib/games/types";
import { useGamesStore } from "@/stores/gamesStore";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { ContinuousCarTrack } from "./ContinuousCarTrack";
import { ContinuousCarTelemetry } from "./ContinuousCarTelemetry";
import { ContinuousCarControls } from "./ContinuousCarControls";
import { CAR_CARD_CONTAINER } from "./gameLayoutStyles";

type Props = {
  state: ContinuousCarState;
};

export function ContinuousCarView({ state }: Props) {
  const setErrorRate = useGamesStore((s) => s.setContinuousCarVillainErrorRate);
  const setTargetLaps = useGamesStore((s) => s.setContinuousCarTargetLaps);
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
      <div className={CAR_CARD_CONTAINER}>
        <div className="w-full aspect-[320/200]">
          <ContinuousCarTrack state={state} />
        </div>
        <ContinuousCarControls
          state={state}
          onErrorRateChange={setErrorRate}
          onTargetLapsChange={setTargetLaps}
          onBoost={onBoost}
        />
        <ContinuousCarTelemetry state={state} />
      </div>
    </div>
  );
}
