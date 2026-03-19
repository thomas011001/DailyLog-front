import { CheckSquare, Plus, Circle } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { EmptySection } from "./shared/SectionHelpers";

/**
 * TaskSection — the left column of DayPage showing all tasks.
 *
 * Props:
 *   tasks          — TaskOut[] (sorted)
 *   draggingId     — string | null  (id of item being dragged)
 *   dragHandlers   — base drag handlers from useDragSort
 *   onSetDragging  — (id | null) => void
 *   onToggle       — (task) => void
 *   onOpenSettings — (task) => void
 *   onOpenCreate   — () => void
 */
export const TaskSection = ({
  tasks,
  draggingId,
  dragHandlers,
  onSetDragging,
  onToggle,
  onOpenSettings,
  onOpenCreate,
}) => (
  <section className="flex-1 flex flex-col overflow-y-auto px-6 md:px-10 py-6 md:py-8 border-b md:border-b-0 border-border">
    {/* Section header */}
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <CheckSquare
          size={13}
          className="text-muted-foreground"
          strokeWidth={2}
        />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Tasks
        </h2>
        {tasks.length > 0 && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground tabular-nums">
            {tasks.filter((t) => t.status === "finished").length}/{tasks.length}
          </span>
        )}
      </div>
      <button
        onClick={onOpenCreate}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all"
      >
        <Plus size={11} /> Add
      </button>
    </div>

    {/* List or empty state */}
    {tasks.length === 0 ? (
      <EmptySection
        icon={Circle}
        label="No tasks yet"
        action="+ Add your first task"
        onAction={onOpenCreate}
      />
    ) : (
      <div className="flex flex-col">
        {tasks.map((task, i) => (
          <TaskItem
            key={task.id}
            task={task}
            index={i}
            isDragging={draggingId === task.id}
            dragHandlers={{
              onDragStart: (idx) => {
                onSetDragging(task.id);
                dragHandlers.onDragStart(idx);
              },
              onDragEnter: dragHandlers.onDragEnter,
              onDragEnd: () => {
                onSetDragging(null);
                dragHandlers.onDragEnd();
              },
            }}
            onToggle={onToggle}
            onOpenSettings={onOpenSettings}
          />
        ))}
      </div>
    )}
  </section>
);
