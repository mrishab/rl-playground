type Props = {
  pellets: Set<string>;
  powerPellets: Set<string>;
  cellSize: number;
};

export function PacmanPellets({ pellets, powerPellets, cellSize }: Props) {
  return (
    <>
      {Array.from(pellets).map((pos) => {
        const [r, c] = pos.split(",").map(Number);
        return (
          <circle
            key={pos}
            cx={(c + 0.5) * cellSize}
            cy={(r + 0.5) * cellSize}
            r="1"
            fill="#facc15"
          />
        );
      })}
      {Array.from(powerPellets).map((pos) => {
        const [r, c] = pos.split(",").map(Number);
        return (
          <circle
            key={pos}
            cx={(c + 0.5) * cellSize}
            cy={(r + 0.5) * cellSize}
            r="2.5"
            fill="#34d399"
            className="animate-pulse"
          />
        );
      })}
    </>
  );
}
