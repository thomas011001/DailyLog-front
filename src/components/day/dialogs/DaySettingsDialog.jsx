import { useState } from "react";
import {
  Settings2,
  Save,
  Trash2,
  Loader2,
  AlertTriangle,
  Type,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { useDay } from "../../../hooks/useDay";
import { useDays } from "../../../context/DaysContext";
import { DialogShell } from "../shared/DialogShell";
import { Field } from "../shared/Field";

/**
 * DaySettingsDialog — modal for editing / deleting the current day.
 *
 * Props:
 *   data      — DayOut
 *   onClose   — () => void
 *   onUpdated — (day: DayOut) => void
 *   onDeleted — () => void  (navigate away after deletion)
 */
export const DaySettingsDialog = ({ data, onClose, onUpdated, onDeleted }) => {
  const { updateDay, deleteDay } = useDay();
  const { editDay, removeDay } = useDays();

  const [fields, setFields] = useState({
    title: data.title ?? "",
    new_date: data.date,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateDay(data.id, {
        title: fields.title || undefined,
        new_date: fields.new_date !== data.date ? fields.new_date : undefined,
      });
      toast.success("Day updated!");
      editDay(updated);
      onUpdated?.(updated);
      onClose();
    } catch (e) {
      toast.error(e.message ?? "Failed to update day.");
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
      await deleteDay(data.id);
      toast.success("Day deleted.");
      removeDay(data.id);
      onDeleted?.();
      onClose();
    } catch (e) {
      toast.error(e.message ?? "Failed to delete day.");
    } finally {
      setDeleting(false);
    }
  };

  const busy = saving || deleting;

  return (
    <DialogShell title="Day Settings" icon={Settings2} onClose={onClose}>
      <div className="flex flex-col gap-4 px-5 py-5">
        <Field
          id="day-title"
          label="Title"
          Icon={Type}
          value={fields.title}
          onChange={(e) => setFields((p) => ({ ...p, title: e.target.value }))}
          disabled={busy}
        />
        <Field
          id="day-date"
          label="Date"
          type="date"
          Icon={CalendarDays}
          value={fields.new_date}
          onChange={(e) =>
            setFields((p) => ({ ...p, new_date: e.target.value }))
          }
          disabled={busy}
        />
      </div>

      <div className="flex items-center justify-between px-5 pb-5">
        {/* Delete side */}
        <div className="flex items-center gap-2">
          {confirmDel && (
            <span className="flex items-center gap-1 text-[11px] text-destructive">
              <AlertTriangle size={11} /> Are you sure?
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
            {confirmDel ? "Confirm" : "Delete day"}
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
