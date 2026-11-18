import type { LemonadeState } from "@/lib/games/types";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { LemonadeLedger } from "./LemonadeLedger";
import { LemonadePolicyTable } from "./LemonadePolicyTable";

type Props = {
  state: LemonadeState;
};

export function LemonadeStandView({ state }: Props) {
  const failureNotice =
    state.controller === "search" ? "Static CSP: Fixed 30c Plan" : null;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner
        gameId="lemonade"
        controller={state.controller}
        failureNotice={failureNotice}
      />
      <div className="max-w-[380px] mx-auto space-y-2.5">
        <LemonadeLedger state={state} />
        <LemonadePolicyTable
          policy={state.learnedPolicy}
          activeWeather={state.weather}
        />
      </div>
    </div>
  );
}
