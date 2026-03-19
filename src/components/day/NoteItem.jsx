import { GripVertical, MoreHorizontal } from "lucide-react";

/**
 * NoteItem — a single draggable note card.
 *
 * Props:
 *   note           — NoteOut
 *   index          — number
 *   isDragging     — boolean
 *   dragHandlers   — { onDragStart, onDragEnter, onDragEnd }
 *   onOpenSettings — (note) => void
 */
export const NoteItem = ({
  note,
  index,
  isDragging,
  dragHandlers,
  onOpenSettings,
}) => (
  <div
    draggable
    onDragStart={() => dragHandlers.onDragStart(index)}
    onDragEnter={() => dragHandlers.onDragEnter(index)}
    onDragEnd={dragHandlers.onDragEnd}
    onDragOver={(e) => e.preventDefault()}
    className="group relative rounded-lg border border-border bg-muted/30 px-4 py-3 hover:border-primary/30 hover:bg-muted/50 transition-all cursor-default"
    style={{
      opacity: isDragging ? 0.4 : 1,
      background: isDragging ? "var(--accent)" : undefined,
      transition: "opacity 0.2s ease",
    }}
  >
    {/* Drag handle */}
    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity cursor-grab active:cursor-grabbing text-foreground">
      <GripVertical size={13} />
    </div>

    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap pr-6 pl-3">
      {note.content}
    </p>

    {/* Settings button */}
    <button
      onClick={() => onOpenSettings(note)}
      className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-foreground hover:bg-accent transition-all"
    >
      <MoreHorizontal size={13} />
    </button>
  </div>
);
