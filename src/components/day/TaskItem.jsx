import { useState } from "react";
import { GripVertical, CircleCheck, MoreHorizontal } from "lucide-react";
import { PRIORITIES } from "./shared/priorities";

/**
 * TaskItem — a single draggable task row.
 *
 * Props:
 *   task           — TaskOut
 *   index          — number  (drag position)
 *   isDragging     — boolean
 *   dragHandlers   — { onDragStart, onDragEnter, onDragEnd }
 *   onToggle       — (task) => void
 *   onOpenSettings — (task) => void
 */
export const TaskItem = ({
  task,
  index,
  isDragging,
  dragHandlers,
  onToggle,
  onOpenSettings,
}) => {
  const p = PRIORITIES[task.priority] ?? PRIORITIES[1];
  const done = task.status === "finished";
  const [justChecked, setJustChecked] = useState(false);

  const handleToggle = () => {
    if (!done) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 700);
    }
    onToggle(task);
  };

  return (
    <div
      draggable
      onDragStart={() => dragHandlers.onDragStart(index)}
      onDragEnter={() => dragHandlers.onDragEnter(index)}
      onDragEnd={dragHandlers.onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="group flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0 cursor-default"
      style={{
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: isDragging ? 0.4 : done ? 0.45 : 1,
        transform: justChecked ? "translateX(6px)" : "translateX(0)",
        background: isDragging ? "var(--accent)" : "transparent",
      }}
    >
      {/* Drag handle */}
      <div className="mt-0.5 shrink-0 w-4 flex items-center justify-center opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity cursor-grab active:cursor-grabbing text-foreground">
        <GripVertical size={13} />
      </div>

      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={[
          "mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
          done
            ? "border-primary bg-primary"
            : "border-border hover:border-primary/60",
        ].join(" ")}
        style={{
          transition:
            "transform 0.15s ease, background 0.25s ease, border-color 0.25s ease",
          transform: justChecked ? "scale(1.25)" : "scale(1)",
        }}
      >
        {done && (
          <CircleCheck
            size={12}
            className="text-primary-foreground"
            fill="currentColor"
          />
        )}
      </button>

      {/* Content */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className={[
            "text-sm leading-snug transition-all",
            done ? "line-through text-muted-foreground" : "text-foreground",
          ].join(" ")}
        >
          {task.title}
        </span>
        {task.description && (
          <span className="text-[11px] text-muted-foreground/70 truncate">
            {task.description}
          </span>
        )}
      </div>

      {/* Priority badge */}
      <span
        className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${p.bg} ${p.border} ${p.color}`}
      >
        {p.label}
      </span>

      {/* Settings button */}
      <button
        onClick={() => onOpenSettings(task)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-foreground hover:bg-accent transition-all"
      >
        <MoreHorizontal size={13} />
      </button>
    </div>
  );
};
