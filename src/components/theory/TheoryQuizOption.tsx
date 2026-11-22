import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  opt: string;
  optIdx: number;
  isSelected: boolean;
  isCorrect: boolean;
  isAnswered?: boolean;
  submitted: boolean;
  onSelect: (idx: number) => void;
}

function getOptStyle(sub: boolean, ans: boolean, corr: boolean, sel: boolean) {
  if (!sub)
    return sel
      ? "bg-primary/10 border-primary font-medium"
      : "hover:bg-muted/40 border-border/70 text-muted-foreground";
  if (ans && corr && sel)
    return "bg-success/15 border-success text-success font-medium";
  if (ans && sel && !corr)
    return "bg-destructive/15 border-destructive text-destructive font-medium";
  if (corr) return "border-success/60 bg-success/5 text-foreground font-medium";
  return "border-border/40 text-muted-foreground opacity-60";
}

export function TheoryQuizOption({
  opt,
  optIdx,
  isSelected,
  isCorrect,
  isAnswered = true,
  submitted,
  onSelect,
}: Props) {
  const cls = getOptStyle(submitted, isAnswered, isCorrect, isSelected);

  return (
    <button
      type="button"
      onClick={() => onSelect(optIdx)}
      className={`text-left p-2 rounded-md text-xs border transition-[color,background-color,border-color] duration-150 ease-out flex items-center justify-between ${cls}`}
    >
      <span>{opt}</span>
      {submitted && isAnswered && isCorrect && isSelected && (
        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
      )}
      {submitted && isSelected && !isCorrect && (
        <XCircle className="h-4 w-4 text-destructive shrink-0" />
      )}
      {submitted && isCorrect && !isSelected && (
        <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
          Correct
        </span>
      )}
    </button>
  );
}
