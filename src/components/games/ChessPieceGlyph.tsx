import type { ChessPieceType } from "@/lib/games/types";

export function ChessPieceGlyph({
  type,
  stroke,
}: {
  type: ChessPieceType;
  stroke: string;
}) {
  if (type === "P") {
    return (
      <>
        <path d="M6 20h12M7.5 18h9l-1.5-6h-6L7.5 18z" />
        <circle cx="12" cy="7.5" r="3.2" />
      </>
    );
  }
  if (type === "R") {
    return (
      <path d="M5 20h14M6 18h12V10l-1-1V6h-2v2h-2V6h-2v2H7V6H5v3l-1 1v8h2z" />
    );
  }
  if (type === "B") {
    return (
      <>
        <path d="M12 4a3.5 3.5 0 0 0-3.5 3.5c0 1.5.8 2.8 2 3.5L9 18h6l-1.5-7c1.2-.7 2-2 2-3.5A3.5 3.5 0 0 0 12 4zM5 20h14" />
        <circle cx="12" cy="3" r="1" />
        <path d="M10 8h4M12 6v4" />
      </>
    );
  }
  if (type === "N") {
    return (
      <>
        <path d="M6 20h12M7 18h10l-1-7c0-2-1.5-4-3.5-5-2 0-3 1-3.5 2.5L7 11l2 1-2 3v3z" />
        <circle cx="13" cy="9" r="0.8" fill={stroke} />
      </>
    );
  }
  if (type === "Q") {
    return (
      <>
        <path d="M5 20h14M6 18h12l1.5-8-3.5 2.5L12 7l-4 5.5L4.5 10 6 18z" />
        <circle cx="4.5" cy="9" r="0.8" fill={stroke} />
        <circle cx="12" cy="6" r="0.8" fill={stroke} />
        <circle cx="19.5" cy="9" r="0.8" fill={stroke} />
      </>
    );
  }
  return (
    <path d="M5 20h14M7 18h10l-1-6.5-2 1.5-2-2-2 2-2-1.5L7 18zM12 3v5M9.5 5.5h5" />
  );
}
