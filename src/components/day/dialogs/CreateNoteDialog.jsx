import { useState } from "react";
import { Plus, Loader2, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { useNote } from "../../../hooks/useNote";
import { DialogShell } from "../shared/DialogShell";
import { Field } from "../shared/Field";

/**
 * CreateNoteDialog — modal for adding a new note to a day.
 *
 * Props:
 *   dayId     — number
 *   onClose   — () => void
 *   onCreated — (note: NoteOut) => void
 */
export const CreateNoteDialog = ({ dayId, onClose, onCreated }) => {
  const { createNote, loading } = useNote();
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Note can't be empty.");
      return;
    }
    try {
      const note = await createNote({ day_id: dayId, content: content.trim() });
      toast.success("Note added!");
      onCreated(note);
      onClose();
    } catch (err) {
      toast.error(err.message ?? "Failed to create note.");
    }
  };

  return (
    <DialogShell title="New Note" icon={Plus} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-5">
          <Field
            id="note-content"
            label="Content"
            Icon={AlignLeft}
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            placeholder="Write your note..."
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
            Add Note
          </button>
        </div>
      </form>
    </DialogShell>
  );
};
