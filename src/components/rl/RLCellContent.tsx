import { Bot, Trophy, Flame, Droplets, Snowflake } from "lucide-react";
import { RLGhostBadge } from "./RLGhostBadge";
import { ARROWS, type RLCellProps } from "./rlCellUtils";
import { RLCellOverlay } from "./RLCellOverlay";

export function RLCellContent(props: RLCellProps) {
  const {
    isStart,
    isAgent,
    isGoal,
    isHazard,
    isObstacle,
    isMud,
    isIce,
    smartObstacle,
    bestAction,
    maxQ,
    showArrows,
  } = props;
  const Arrow = bestAction !== undefined ? ARROWS[bestAction] : null;

  return (
    <>
      {isObstacle && (
        <div className="w-full h-full bg-muted-foreground/30 rounded-xs" />
      )}
      {isGoal && <Trophy className="h-5 w-5 animate-bounce text-primary" />}
      {isHazard && <Flame className="h-5 w-5 text-destructive" />}
      {isMud && <Droplets className="h-4 w-4 text-warning" />}
      {isIce && <Snowflake className="h-4 w-4 text-info animate-pulse" />}
      {smartObstacle && !isAgent && (
        <RLGhostBadge strategy={smartObstacle.strategy} />
      )}
      {isStart && !isAgent && !isObstacle && (
        <span className="absolute top-1 left-1 text-[9px] font-mono text-muted-foreground font-bold">
          S
        </span>
      )}
      {isAgent && (
        <div className="absolute z-10 p-1 rounded-full bg-primary text-primary-foreground shadow-md animate-pulse">
          <Bot className="h-4 w-4" />
        </div>
      )}
      {!isAgent && !isObstacle && !isGoal && !smartObstacle && (
        <>
          {showArrows && Arrow && maxQ !== 0 && (
            <Arrow className="h-3.5 w-3.5 text-muted-foreground/80" />
          )}
          <RLCellOverlay {...props} />
        </>
      )}
    </>
  );
}
