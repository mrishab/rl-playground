interface Props {
  query: string;
  onClear: () => void;
}

export function AgentsSearchEmpty({ query, onClear }: Props) {
  return (
    <div className="border border-dashed rounded-lg p-8 text-center space-y-2">
      <p className="text-sm font-semibold">
        No saved agents found matching &ldquo;{query}&rdquo;
      </p>
      <p className="text-xs text-muted-foreground">
        Try a different name or algorithm filter.
      </p>
      <button
        type="button"
        className="text-xs text-primary underline font-medium hover:opacity-80 pt-1"
        onClick={onClear}
      >
        Clear Search
      </button>
    </div>
  );
}
