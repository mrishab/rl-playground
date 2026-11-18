interface Props {
  gridSize: number;
  onSetGridSize: (size: number) => void;
}

export function RLGridSizeSelector({ gridSize, onSetGridSize }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>Grid:</span>
      {[4, 5, 6, 8].map((sz) => (
        <button
          key={sz}
          type="button"
          onClick={() => onSetGridSize(sz)}
          className={`px-1.5 py-0.5 rounded text-[11px] font-mono border transition-[color,background-color,border-color] duration-150 ease-out ${
            gridSize === sz
              ? "bg-primary text-primary-foreground font-bold"
              : "hover:bg-muted"
          }`}
        >
          {sz}x{sz}
        </button>
      ))}
    </div>
  );
}
