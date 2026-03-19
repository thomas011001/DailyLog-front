import { useState } from "react";
import {
  Settings2,
  Save,
  Trash2,
  Loader2,
  AlertTriangle,
  AlignLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useNote } from "../../../hooks/useNote";
import { DialogShell } from "../shared/DialogShell";
import { Field } from "../shared/Field";

/**
 * NoteSettingsDialog — modal for editing / deleting an existing note.
 *
 * Props:
 *   note      — NoteOut
 *   onClose   — () => void
 *   onUpdated — (note: NoteOut) => void
 *   onDeleted — (noteId: number) => void
 */
export const NoteSettingsDialog = ({ note, onClose, onUpdated, onDeleted }) => {
  const { updateNote, deleteNote } = useNote();
  const [content, setContent] = useState(note.content ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Note can't be empty.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateNote(note.id, { content: content.trim() });
      toast.success("Note updated!");
      onUpdated(updated);
      onClose();
    } catch (e) {
      toast.error(e.message ?? "Failed to update note.");
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
      await deleteNote(note.id);
      toast.success("Note deleted.");
      onDeleted(note.id);
      onClose();
    } catch (e) {
      toast.error(e.message ?? "Failed to delete note.");
    } finally {
      setDeleting(false);
    }
  };

  const busy = saving || deleting;

  return (
    <DialogShell title="Note Settings" icon={Settings2} onClose={onClose}>
      <div className="px-5 py-5">
        <Field
          id="edit-note"
          label="Content"
          Icon={AlignLeft}
          as="textarea"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
