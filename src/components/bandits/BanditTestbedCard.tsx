import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BanditArm } from "@/lib/rl/types";
import { BanditArmCard } from "./BanditArmCard";

interface Props {
  arms: BanditArm[];
  optimalIdx: number;
}

export function BanditTestbedCard({ arms, optimalIdx }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          10-Armed Testbed Values
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {arms.map((arm) => (
            <BanditArmCard
              key={arm.id}
              arm={arm}
              isOptimal={arm.id === optimalIdx}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
