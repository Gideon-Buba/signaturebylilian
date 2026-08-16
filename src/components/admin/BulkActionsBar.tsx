import type { ReactNode } from "react";

export function BulkActionsBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 border border-accent/40 bg-accent/5 px-4 py-3">
      <span className="text-sm text-foreground">
        {count} selected
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Clear selection
      </button>
    </div>
  );
}
