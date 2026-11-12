import { useEffect, useRef } from "react";
import { useGamesStore } from "@/stores/gamesStore";

export function useGameLoop() {
  const isPlaying = useGamesStore((s) => s.isPlaying);
  const speed = useGamesStore((s) => s.speed);
  const stepSingle = useGamesStore((s) => s.stepSingle);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const interval = 1000 / (30 * speed);

    const loop = (time: number) => {
      if (time - lastTimeRef.current >= interval) {
        lastTimeRef.current = time;
        stepSingle();
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speed, stepSingle]);
}
