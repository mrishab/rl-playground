import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditArm } from "@/lib/rl/types";
import { BanditArmCard } from "./BanditArmCard";
import { BanditTestbedLegend } from "./BanditTestbedLegend";

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
  const domainMax = Math.max(
    3,
    ...arms.map((a) =>
      Math.max(Math.abs(a.estimatedValue), Math.abs(a.trueMean)),
    ),
  );

  return (
    <Card>
      <CardHeader className="pb-1.5 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <CardTitle className="text-sm font-semibold">
            10-Armed Testbed
          </CardTitle>
          <BanditTestbedLegend />
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {arms.map((arm) => (
            <BanditArmCard
              key={arm.id}
              arm={arm}
              isOptimal={arm.id === optimalIdx}
              algorithm={algorithm}
              domainMax={domainMax}
              onPull={onPull}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
