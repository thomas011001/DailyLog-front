import { StickyNote, Plus, Inbox } from "lucide-react";
import { NoteItem } from "./NoteItem";
import { EmptySection } from "./shared/SectionHelpers";

/**
 * NoteSection — the right column of DayPage showing all notes.
 *
 * Props:
 *   notes          — NoteOut[] (sorted)
 *   draggingId     — string | null
 *   dragHandlers   — base drag handlers from useDragSort
 *   onSetDragging  — (id | null) => void
 *   onOpenSettings — (note) => void
 *   onOpenCreate   — () => void
 */
export const NoteSection = ({
  notes,
  draggingId,
  dragHandlers,
  onSetDragging,
  onOpenSettings,
  onOpenCreate,
}) => (
  <section className="flex-1 flex flex-col overflow-y-auto px-6 md:px-10 py-6 md:py-8">
    {/* Section header */}
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <StickyNote
          size={13}
          className="text-muted-foreground"
          strokeWidth={2}
        />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Notes
        </h2>
        {notes.length > 0 && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground tabular-nums">
            {notes.length}
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
    {notes.length === 0 ? (
      <EmptySection
        icon={Inbox}
        label="No notes yet"
        action="+ Add your first note"
        onAction={onOpenCreate}
      />
    ) : (
      <div className="flex flex-col gap-3">
        {notes.map((note, i) => (
          <NoteItem
            key={note.id}
            note={note}
            index={i}
            isDragging={draggingId === note.id}
            dragHandlers={{
              onDragStart: (idx) => {
                onSetDragging(note.id);
                dragHandlers.onDragStart(idx);
              },
              onDragEnter: dragHandlers.onDragEnter,
              onDragEnd: () => {
                onSetDragging(null);
                dragHandlers.onDragEnd();
              },
            }}
            onOpenSettings={onOpenSettings}
          />
        ))}
      </div>
    )}
  </section>
);
