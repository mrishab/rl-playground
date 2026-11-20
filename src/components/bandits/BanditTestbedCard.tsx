import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditArm } from "@/lib/rl/types";
import { BanditArmCard } from "./BanditArmCard";

interface Props {
  arms: BanditArm[];
  optimalIdx: number;
  algorithm?: string;
  onPull?: (id: number) => void;
}

export function BanditTestbedCard({
  arms,
  optimalIdx,
  algorithm,
  onPull,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            10-Armed Testbed Values
          </CardTitle>
          <span className="text-[11px] text-muted-foreground">
            Click any arm card for manual pull
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {arms.map((arm) => (
            <BanditArmCard
              key={arm.id}
              arm={arm}
              isOptimal={arm.id === optimalIdx}
              algorithm={algorithm}
              onPull={onPull}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
