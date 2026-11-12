import { Gamepad2, Ghost, Swords, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameId } from "@/lib/games/types";

type Props = {
  activeGame: GameId;
  onSelect: (game: GameId) => void;
};

const GAMES: { id: GameId; label: string; icon: typeof Gamepad2 }[] = [
  { id: "pong", label: "Pong (Ping Pong)", icon: Gamepad2 },
  { id: "pacman", label: "Pac-Man (Maze)", icon: Ghost },
  { id: "chess", label: "Grid Chess", icon: Swords },
  { id: "strategy", label: "Grid Strategy", icon: Shield },
];

export function GameTabBar({ activeGame, onSelect }: Props) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border/40 w-fit">
      {GAMES.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          size="sm"
          variant={activeGame === id ? "default" : "ghost"}
          className={`h-8 px-3 text-xs gap-1.5 font-medium transition-all ${
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
