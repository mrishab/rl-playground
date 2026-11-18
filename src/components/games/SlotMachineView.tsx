import type { SlotMachineState } from "@/lib/games/types";
import { SearchComparisonBanner } from "./SearchComparisonBanner";
import { SlotMachineReels } from "./SlotMachineReels";
import { SlotMachineArmCard } from "./SlotMachineArmCard";

type Props = {
  state: SlotMachineState;
};

export function SlotMachineView({ state }: Props) {
  const failureNotice =
    state.controller === "search" ? "Static Greedy (Zero Exploration)" : null;

  return (
    <div className="space-y-3">
      <SearchComparisonBanner
        gameId="slot-machine"
        controller={state.controller}
        failureNotice={failureNotice}
      />
      <div className="max-w-[380px] mx-auto space-y-2.5">
        <SlotMachineReels state={state} />
        <SlotMachineArmCard
          machines={state.machines}
          lastArm={state.lastPullArm}
        />
      </div>
    </div>
  );
}
