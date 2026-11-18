import {
  Gamepad2,
  Ghost,
  Swords,
  Shield,
  Snowflake,
  Coins,
  Citrus,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameId } from "@/lib/games/types";

interface Props {
  activeGame: GameId;
  onSelect: (game: GameId) => void;
}

const GAMES: { id: GameId; label: string; icon: typeof Gamepad2 }[] = [
  { id: "ice-maze", label: "Ice Maze", icon: Snowflake },
  { id: "slot-machine", label: "Slot Machine", icon: Coins },
  { id: "lemonade", label: "Lemonade Stand", icon: Citrus },
  { id: "continuous-car", label: "Continuous Car", icon: Car },
  { id: "pong", label: "Pong", icon: Gamepad2 },
  { id: "pacman", label: "Pac-Man", icon: Ghost },
  { id: "chess", label: "Grid Chess", icon: Swords },
  { id: "strategy", label: "Grid Strategy", icon: Shield },
];

export function GameTabBar({ activeGame, onSelect }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/40 rounded-lg border border-border/40 w-fit">
      {GAMES.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          size="sm"
          variant={activeGame === id ? "default" : "ghost"}
          className={`h-7 px-2.5 text-xs gap-1.5 font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out ${
            activeGame === id
              ? "shadow-xs font-semibold"
              : "text-muted-foreground"
          }`}
          onClick={() => onSelect(id)}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
