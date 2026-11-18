import type { ContinuousCarState } from "@/lib/games/types";
import { ContinuousCarVillains } from "./ContinuousCarVillains";
import { ContinuousCarAgentVehicle } from "./ContinuousCarAgentVehicle";

type Props = {
  state: ContinuousCarState;
};

export function ContinuousCarVehicles({ state }: Props) {
  return (
    <g>
      <ContinuousCarVillains villains={state.villains} />
      <ContinuousCarAgentVehicle state={state} />
    </g>
  );
}
