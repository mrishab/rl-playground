import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  opt: string;
  optIdx: number;
  isSelected: boolean;
  isCorrect: boolean;
  submitted: boolean;
  onSelect: (idx: number) => void;
}

export function TheoryQuizOption({
  opt,
  optIdx,
  isSelected,
  isCorrect,
  submitted,
  onSelect,
}: Props) {
  const style =
    submitted && isCorrect
      ? "bg-success/15 border-success text-success font-medium"
      : submitted && isSelected && !isCorrect
        ? "bg-destructive/15 border-destructive text-destructive font-medium"
        : isSelected
          ? "bg-primary/10 border-primary font-medium"
          : "hover:bg-muted/40 border-border/70 text-muted-foreground";

  return (
    <button
      type="button"
      onClick={() => onSelect(optIdx)}
      className={`text-left p-2 rounded-md text-xs border transition-[color,background-color,border-color] duration-150 ease-out flex items-center justify-between ${style}`}
    >
      <span>{opt}</span>
      {submitted && isCorrect && (
        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
      )}
      {submitted && isSelected && !isCorrect && (
        <XCircle className="h-4 w-4 text-destructive shrink-0" />
      )}
    </button>
  );
}
