import { useState } from "react";
import {
  Settings2,
  Save,
  Trash2,
  Loader2,
  AlertTriangle,
  Type,
  AlignLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useTask } from "../../../hooks/useTask";
import { DialogShell } from "../shared/DialogShell";
import { Field } from "../shared/Field";
import { PriorityPicker } from "../shared/priorities";

/**
 * TaskSettingsDialog — modal for editing / deleting an existing task.
 *
 * Props:
 *   task      — TaskOut
 *   onClose   — () => void
 *   onUpdated — (task: TaskOut) => void
 *   onDeleted — (taskId: number) => void
 */
export const TaskSettingsDialog = ({ task, onClose, onUpdated, onDeleted }) => {
  const { updateTask, deleteTask } = useTask();
  const [fields, setFields] = useState({
    title: task.title ?? "",
    description: task.description ?? "",
    priority: task.priority ?? 1,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const set = (key) => (e) =>
    setFields((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateTask(task.id, {
        title: fields.title.trim() || undefined,
        description: fields.description || undefined,
        priority: Number(fields.priority),
      });
      toast.success("Task updated!");
      onUpdated(updated);
      onClose();
    } catch (e) {
      toast.error(e.message ?? "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDel) {
      setConfirmDel(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted.");
      onDeleted(task.id);
      onClose();
    } catch (e) {
      toast.error(e.message ?? "Failed to delete task.");
    } finally {
      setDeleting(false);
    }
  };

  const busy = saving || deleting;

  return (
    <DialogShell title="Task Settings" icon={Settings2} onClose={onClose}>
      <div className="flex flex-col gap-4 px-5 py-5">
        <Field
          id="edit-title"
          label="Title"
          Icon={Type}
          value={fields.title}
          onChange={set("title")}
          disabled={busy}
          placeholder="Task title"
        />

        <Field
          id="edit-desc"
          label="Description"
          Icon={AlignLeft}
          as="textarea"
          value={fields.description}
          onChange={set("description")}
          disabled={busy}
          placeholder="Optional details..."
        />

        <PriorityPicker
          value={fields.priority}
          onChange={(n) => setFields((p) => ({ ...p, priority: n }))}
          disabled={busy}
        />
      </div>

      <div className="flex items-center justify-between px-5 pb-5">
        {/* Delete side */}
        <div className="flex items-center gap-2">
          {confirmDel && (
            <span className="flex items-center gap-1 text-[11px] text-destructive">
              <AlertTriangle size={11} /> Sure?
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={busy}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50",
              confirmDel
                ? "bg-destructive text-white hover:opacity-90"
                : "text-destructive hover:bg-destructive/10",
            ].join(" ")}
          >
            {deleting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            {confirmDel ? "Confirm" : "Delete"}
          </button>
          {confirmDel && (
            <button
              onClick={() => setConfirmDel(false)}
              className="text-xs text-foreground/50 hover:text-foreground transition-colors px-1"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={busy}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Save size={12} />
          )}
          Save
        </button>
      </div>
    </DialogShell>
  );
};
