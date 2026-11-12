import { Bot, Trophy, Flame, Droplets, Snowflake } from "lucide-react";
import { RLGhostBadge } from "./RLGhostBadge";
import { ARROWS, type RLCellProps } from "./rlCellUtils";

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
    qValues,
    visits,
    showArrows,
    showQRose,
    showVisits,
  } = props;
  const Arrow = bestAction !== undefined ? ARROWS[bestAction] : null;

  return (
    <>
      {isObstacle && (
        <div className="w-full h-full bg-muted-foreground/30 rounded-xs" />
      )}
      {isGoal && <Trophy className="h-5 w-5 animate-bounce text-primary" />}
      {isHazard && <Flame className="h-5 w-5 text-destructive" />}
      {isMud && (
        <Droplets className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      )}
      {isIce && <Snowflake className="h-4 w-4 text-cyan-500 animate-pulse" />}
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

          {showVisits && visits !== undefined && visits > 0 && (
            <span className="absolute bottom-0.5 left-0.5 text-[8px] font-mono text-muted-foreground/90 bg-muted/70 px-0.5 rounded">
              v:{visits}
            </span>
          )}

          {showQRose && qValues && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-[7px] font-mono pointer-events-none p-0.5 text-muted-foreground/80">
              <span className="col-start-2 row-start-1 text-center leading-none">
                {qValues[0].toFixed(0)}
              </span>
              <span className="col-start-1 row-start-2 text-left leading-none">
                {qValues[3].toFixed(0)}
              </span>
              <span className="col-start-3 row-start-2 text-right leading-none">
                {qValues[1].toFixed(0)}
              </span>
              <span className="col-start-2 row-start-3 text-center leading-none">
                {qValues[2].toFixed(0)}
              </span>
            </div>
          )}
        </>
      )}
      {props.isBFSPath && !isGoal && (
        <span
          className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"
          title="BFS Path Step"
        />
      )}
    </>
  );
}
