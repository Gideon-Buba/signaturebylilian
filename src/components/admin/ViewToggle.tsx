import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex border border-border">
      <button
        type="button"
        aria-label="List view"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "p-2.5 text-muted-foreground transition-colors hover:text-foreground",
          value === "list" && "bg-secondary text-foreground",
        )}
      >
        <List className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
        className={cn(
          "border-l border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground",
          value === "grid" && "bg-secondary text-foreground",
        )}
      >
        <LayoutGrid className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
