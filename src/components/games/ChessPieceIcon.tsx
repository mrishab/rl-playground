import type { ChessPieceColor, ChessPieceType } from "@/lib/games/types";

interface Props {
  type: ChessPieceType;
  color: ChessPieceColor;
  className?: string;
}

export function ChessPieceIcon({ type, color, className = "w-7 h-7" }: Props) {
  const isWhite = color === "w";
  const fill = isWhite ? "rgba(255,255,255,0.25)" : "currentColor";
  const colorClass = isWhite
    ? "text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
    : "text-destructive drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]";

  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${colorClass} ${className} shrink-0 select-none`}
    >
      {type === "P" && (
        <>
          <path d="M6 20h12M7.5 18h9l-1.5-6h-6L7.5 18z" />
          <circle cx="12" cy="7.5" r="3.2" />
        </>
      )}
      {type === "R" && (
        <path d="M5 20h14M6 18h12V10l-1-1V6h-2v2h-2V6h-2v2H7V6H5v3l-1 1v8h2z" />
      )}
      {type === "N" && (
        <>
          <path d="M6 20h12M7 18h10l-1-7c0-2-1.5-4-3.5-5-2 0-3 1-3.5 2.5L7 11l2 1-2 3v3z" />
          <circle cx="13" cy="9" r="0.8" fill="currentColor" />
        </>
      )}
      {type === "Q" && (
        <>
          <path d="M5 20h14M6 18h12l1.5-8-3.5 2.5L12 7l-4 5.5L4.5 10 6 18z" />
          <circle cx="4.5" cy="9" r="1" fill="currentColor" />
          <circle cx="12" cy="6" r="1" fill="currentColor" />
          <circle cx="19.5" cy="9" r="1" fill="currentColor" />
        </>
      )}
      {type === "K" && (
        <>
          <path d="M5 20h14M7 18h10l-1-6.5-2 1.5-2-2-2 2-2-1.5L7 18z" />
          <path d="M12 3v5M9.5 5.5h5" />
        </>
      )}
    </svg>
  );
}
