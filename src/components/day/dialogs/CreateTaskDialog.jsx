import { useState } from "react";
import { Plus, Loader2, Type, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { useTask } from "../../../hooks/useTask";
import { DialogShell } from "../shared/DialogShell";
import { Field } from "../shared/Field";
import { PriorityPicker } from "../shared/priorities";

/**
 * CreateTaskDialog — modal for adding a new task to a day.
 *
 * Props:
 *   dayId     — number
 *   onClose   — () => void
 *   onCreated — (task: TaskOut) => void
 */
export const CreateTaskDialog = ({ dayId, onClose, onCreated }) => {
  const { createTask, loading } = useTask();
  const [fields, setFields] = useState({
    title: "",
    description: "",
    priority: 1,
  });

  const set = (key) => (e) =>
    setFields((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      const task = await createTask({
        day_id: dayId,
        title: fields.title.trim(),
        description: fields.description || undefined,
        priority: Number(fields.priority),
      });
      toast.success("Task added!");
      onCreated(task);
      onClose();
    } catch (err) {
      toast.error(err.message ?? "Failed to create task.");
    }
  };

  return (
    <DialogShell title="New Task" icon={Plus} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 px-5 py-5">
          <Field
            id="task-title"
            label="Title"
            Icon={Type}
            value={fields.title}
            onChange={set("title")}
            disabled={loading}
            placeholder="What needs to be done?"
          />

          <Field
            id="task-desc"
            label="Description"
            Icon={AlignLeft}
            as="textarea"
            value={fields.description}
            onChange={set("description")}
            disabled={loading}
            placeholder="Optional details..."
          />

          <PriorityPicker
            value={fields.priority}
            onChange={(n) => setFields((p) => ({ ...p, priority: n }))}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg text-xs text-foreground/50 hover:text-foreground hover:bg-accent transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Plus size={12} />
            )}
            Add Task
          </button>
        </div>
      </form>
    </DialogShell>
  );
};
