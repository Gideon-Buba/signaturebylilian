import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { ReactNode } from "react";

export type DragHandleProps = {
  attributes: DraggableAttributes;
  listeners: Record<string, Function> | undefined;
  isDragging: boolean;
};

// Renders as either a table row or a plain div so the same drag-and-drop
// wiring works for both the list (table) and grid views.
export function SortableItem({
  id,
  as: Tag = "div",
  className,
  children,
}: {
  id: string;
  as?: "tr" | "div";
  className?: string;
  children: (drag: DragHandleProps) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Tag ref={setNodeRef} style={style} className={className}>
      {children({ attributes, listeners, isDragging })}
    </Tag>
  );
}
