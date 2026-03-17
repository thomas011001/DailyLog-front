import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDay } from "../hooks/useDay";
import { useTask } from "../hooks/useTask";
import { useNote } from "../hooks/useNote";
import { useDays } from "../context/DaysContext";
import { useDragSort } from "../hooks/useDragSort";
import {
  CalendarDays,
  CheckSquare,
  StickyNote,
  Inbox,
  Settings2,
  Trash2,
  Save,
  X,
  Loader2,
  Type,
  AlertTriangle,
  Plus,
  Circle,
  CircleCheck,
  Flag,
  AlignLeft,
  Clock,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    dayNum: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "long" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    year: d.toLocaleDateString("en-US", { year: "numeric" }),
    isToday: new Date().toDateString() === d.toDateString(),
  };
};

// ─── Priority config ───────────────────────────────────────────────────────────

const PRIORITIES = {
  1: {
    label: "Low",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  2: {
    label: "Medium",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  3: {
    label: "High",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Sk = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const DayPageSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="px-6 md:px-10 pt-8 md:pt-10 pb-8 border-b border-border">
      <Sk className="h-3 w-24 mb-4" />
      <Sk className="h-10 md:h-14 w-48 md:w-64 mb-2" />
      <Sk className="h-2 w-full mt-4 rounded-full" />
    </div>
    <div className="flex flex-col md:flex-row flex-1 md:divide-x divide-border overflow-hidden">
      <div className="flex-1 px-6 md:px-10 py-6 md:py-8 flex flex-col gap-3 border-b md:border-b-0 border-border">
        <Sk className="h-3 w-20 mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Sk className="h-5 w-5 shrink-0 rounded-full" />
            <Sk className="h-3 flex-1" />
            <Sk className="h-4 w-12 rounded-full" />
          </div>
        ))}
      </div>
      <div className="flex-1 px-6 md:px-10 py-6 md:py-8 flex flex-col gap-3">
        <Sk className="h-3 w-20 mb-2" />
        {[1, 2].map((i) => (
          <Sk key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// ─── Shared field ─────────────────────────────────────────────────────────────

const Field = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  Icon,
  placeholder,
  as,
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60"
    >
      {Icon && <Icon size={10} className="text-foreground/60" />}
      {label}
    </label>
    {as === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground
            placeholder:text-foreground/30 resize-none
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground
            placeholder:text-foreground/30
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
      />
    )}
  </div>
);

// ─── Dialog shell ─────────────────────────────────────────────────────────────

const DialogShell = ({
  title,
  icon: Icon,
  accentClass = "via-primary",
  onClose,
  children,
}) => {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div
          className={`h-0.5 w-full bg-gradient-to-r from-transparent ${accentClass} to-transparent`}
        />
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-foreground/70" />}
            <span className="text-sm font-semibold text-foreground">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-foreground/50 hover:text-foreground hover:bg-accent transition-colors"
          >
            <X size={13} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Create Task Dialog ────────────────────────────────────────────────────────

const CreateTaskDialog = ({ dayId, onClose, onCreated }) => {
  const { createTask, loading } = useTask();
  const [fields, setFields] = useState({
    title: "",
    description: "",
    priority: 1,
  });

  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));

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
    <DialogShell
      title="New Task"
      icon={Plus}
      accentClass="via-primary"
      onClose={onClose}
    >
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

          {/* Priority picker */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
              <Flag size={10} className="text-foreground/60" /> Priority
            </span>
            <div className="flex gap-2">
              {Object.entries(PRIORITIES).map(
                ([val, { label, color, bg, border }]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() =>
                      setFields((p) => ({ ...p, priority: Number(val) }))
                    }
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${
                      Number(fields.priority) === Number(val)
                        ? `${bg} ${border} ${color}`
                        : "border-border text-foreground/40 hover:text-foreground/70"
                    }`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>
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

// ─── Task Settings Dialog ──────────────────────────────────────────────────────

const TaskSettingsDialog = ({ task, onClose, onUpdated, onDeleted }) => {
  const { updateTask, deleteTask } = useTask();
  const [fields, setFields] = useState({
    title: task.title ?? "",
    description: task.description ?? "",
    priority: task.priority ?? 1,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));

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

  return (
    <DialogShell
      title="Task Settings"
      icon={Settings2}
      accentClass="via-primary"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4 px-5 py-5">
        <Field
          id="edit-title"
          label="Title"
          Icon={Type}
          value={fields.title}
          onChange={set("title")}
          disabled={saving || deleting}
          placeholder="Task title"
        />

        <Field
          id="edit-desc"
          label="Description"
          Icon={AlignLeft}
          as="textarea"
          value={fields.description}
          onChange={set("description")}
          disabled={saving || deleting}
          placeholder="Optional details..."
        />

        {/* Priority picker */}
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
            <Flag size={10} className="text-foreground/60" /> Priority
          </span>
          <div className="flex gap-2">
            {Object.entries(PRIORITIES).map(
              ([val, { label, color, bg, border }]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    setFields((p) => ({ ...p, priority: Number(val) }))
                  }
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all
                  ${
                    Number(fields.priority) === Number(val)
                      ? `${bg} ${border} ${color}`
                      : "border-border text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-5">
        <div className="flex items-center gap-2">
          {confirmDel && (
            <span className="flex items-center gap-1 text-[11px] text-destructive">
              <AlertTriangle size={11} /> Sure?
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting || saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50
              ${confirmDel ? "bg-destructive text-white hover:opacity-90" : "text-destructive hover:bg-destructive/10"}`}
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
        <button
          onClick={handleSave}
          disabled={saving || deleting}
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

// ─── Task Item ────────────────────────────────────────────────────────────────

const TaskItem = ({
  task,
  onToggle,
  onOpenSettings,
  dragHandlers,
  index,
  isDragging,
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
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${done ? "border-primary bg-primary" : "border-border hover:border-primary/60"}`}
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
          className={`text-sm leading-snug transition-all ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
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

// ─── Note Item ────────────────────────────────────────────────────────────────

const NoteItem = ({
  note,
  onOpenSettings,
  dragHandlers,
  index,
  isDragging,
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
    <button
      onClick={() => onOpenSettings(note)}
      className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-foreground hover:bg-accent transition-all"
    >
      <MoreHorizontal size={13} />
    </button>
  </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────

const TaskProgress = ({ tasks = [] }) => {
  if (!tasks.length) return null;
  const done = tasks.filter((t) => t.status === "finished").length;
  const pct = Math.round((done / tasks.length) * 100);
  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground font-medium">
        {done}/{tasks.length}
      </span>
    </div>
  );
};

// ─── Empty section ────────────────────────────────────────────────────────────

const EmptySection = ({ icon: Icon, label, action, onAction }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground/40">
    <Icon size={24} strokeWidth={1.25} />
    <span className="text-xs tracking-wider uppercase">{label}</span>
    {action && (
      <button
        onClick={onAction}
        className="text-xs text-primary/60 hover:text-primary underline-offset-4 hover:underline transition-colors"
      >
        {action}
      </button>
    )}
  </div>
);

// ─── Create Note Dialog ────────────────────────────────────────────────────────

const CreateNoteDialog = ({ dayId, onClose, onCreated }) => {
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
    <DialogShell
      title="New Note"
      icon={Plus}
      accentClass="via-primary"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="note-content"
              className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60"
            >
              <AlignLeft size={10} className="text-foreground/60" /> Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              placeholder="Write your note..."
              rows={5}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground
                placeholder:text-foreground/30 resize-none
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
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

// ─── Note Settings Dialog ──────────────────────────────────────────────────────

const NoteSettingsDialog = ({ note, onClose, onUpdated, onDeleted }) => {
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

  return (
    <DialogShell
      title="Note Settings"
      icon={Settings2}
      accentClass="via-primary"
      onClose={onClose}
    >
      <div className="px-5 py-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="edit-note"
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60"
          >
            <AlignLeft size={10} className="text-foreground/60" /> Content
          </label>
          <textarea
            id="edit-note"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={saving || deleting}
            rows={5}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground
              placeholder:text-foreground/30 resize-none
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 pb-5">
        <div className="flex items-center gap-2">
          {confirmDel && (
            <span className="flex items-center gap-1 text-[11px] text-destructive">
              <AlertTriangle size={11} /> Sure?
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting || saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50
              ${confirmDel ? "bg-destructive text-white hover:opacity-90" : "text-destructive hover:bg-destructive/10"}`}
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
        <button
          onClick={handleSave}
          disabled={saving || deleting}
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

// ─── Day Settings Dialog ──────────────────────────────────────────────────────

const DaySettingsDialog = ({ data, onClose, onUpdated, onDeleted }) => {
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

  return (
    <DialogShell title="Day Settings" icon={Settings2} onClose={onClose}>
      <div className="flex flex-col gap-4 px-5 py-5">
        <Field
          id="day-title"
          label="Title"
          Icon={Type}
          value={fields.title}
          onChange={(e) => setFields((p) => ({ ...p, title: e.target.value }))}
          disabled={saving || deleting}
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
          disabled={saving || deleting}
        />
      </div>
      <div className="flex items-center justify-between px-5 pb-5">
        <div className="flex items-center gap-2">
          {confirmDel && (
            <span className="flex items-center gap-1 text-[11px] text-destructive">
              <AlertTriangle size={11} /> Are you sure?
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting || saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50
              ${confirmDel ? "bg-destructive text-white hover:opacity-90" : "text-destructive hover:bg-destructive/10"}`}
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
        <button
          onClick={handleSave}
          disabled={saving || deleting}
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

// ─── Day Page ─────────────────────────────────────────────────────────────────

export function DayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDay, loading, error } = useDay();
  const { updateTask } = useTask();
  const [data, setData] = useState(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingNote, setDraggingNote] = useState(null);
  const [showDaySettings, setShowDaySettings] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskSettings, setTaskSettings] = useState(null);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [noteSettings, setNoteSettings] = useState(null);

  const taskDrag = useDragSort(data?.tasks ?? [], id, "tasks");
  const noteDrag = useDragSort(data?.notes ?? [], id, "notes");

  useEffect(() => {
    if (!id) return;
    setData(null);
    getDay(id)
      .then(setData)
      .catch(() => {});
  }, [id]);

  // ── Task mutations ────────────────────────────────────────────────────────────
  const addTask = (task) => {
    setData((prev) => ({ ...prev, tasks: [...(prev.tasks ?? []), task] }));
    taskDrag.addSorted(task);
  };

  const patchTask = (updated) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        String(t.id) === String(updated.id) ? { ...t, ...updated } : t,
      ),
    }));
    taskDrag.patchSorted(updated);
  };

  const removeTask = (taskId) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => String(t.id) !== String(taskId)),
    }));
    taskDrag.removeSorted(taskId);
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === "finished" ? "pending" : "finished";
    // Optimistic update in place
    taskDrag.patchSorted({ ...task, status: newStatus });
    // Delay reorder until animation finishes
    setTimeout(() => {
      taskDrag.setSorted((prev) =>
        [
          ...prev.map((t) =>
            String(t.id) === String(task.id) ? { ...t, status: newStatus } : t,
          ),
        ].sort(
          (a, b) =>
            (a.status === "finished" ? 1 : 0) -
            (b.status === "finished" ? 1 : 0),
        ),
      );
    }, 600);
    try {
      const updated = await updateTask(task.id, { status: newStatus });
      taskDrag.patchSorted({ ...task, ...updated });
    } catch {
      taskDrag.patchSorted(task);
      toast.error("Failed to update task.");
    }
  };

  // ── Note mutations ────────────────────────────────────────────────────────────
  const addNote = (note) => {
    setData((prev) => ({ ...prev, notes: [...(prev.notes ?? []), note] }));
    noteDrag.addSorted(note);
  };

  const patchNote = (updated) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        String(n.id) === String(updated.id) ? { ...n, ...updated } : n,
      ),
    }));
    noteDrag.patchSorted(updated);
  };

  const removeNote = (noteId) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => String(n.id) !== String(noteId)),
    }));
    noteDrag.removeSorted(noteId);
  };

  if (loading) return <DayPageSkeleton />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <CalendarDays size={32} strokeWidth={1.25} />
        <p className="text-sm">{error}</p>
      </div>
    );
  if (!data) return <DayPageSkeleton />;

  const { dayNum, month, weekday, year, isToday } = formatDate(data.date);
  const tasks = taskDrag.sorted;
  const notes = noteDrag.sorted;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        {/* ── Header ── */}
        <header className="px-6 md:px-10 pt-8 md:pt-10 pb-6 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {isToday && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    Today
                  </span>
                )}
                <span className="text-xs text-muted-foreground tracking-wider uppercase">
                  {weekday}
                </span>
              </div>
              <div className="flex items-end gap-4 flex-wrap">
                <span
                  className="font-black leading-none text-foreground select-none"
                  style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
                >
                  {dayNum}
                </span>
                <div className="flex flex-col pb-2">
                  <span className="text-xl font-semibold text-foreground">
                    {month}
                  </span>
                  <span className="text-sm text-muted-foreground">{year}</span>
                </div>
                {data.title && (
                  <>
                    <div className="w-px h-10 bg-border self-center" />
                    <h1 className="text-xl font-medium text-foreground pb-1 self-end truncate max-w-[200px]">
                      {data.title}
                    </h1>
                  </>
                )}
              </div>
              <TaskProgress tasks={tasks} />
            </div>

            {/* Day settings button */}
            <button
              onClick={() => setShowDaySettings(true)}
              className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-foreground/50 hover:text-foreground hover:bg-accent transition-colors shrink-0"
            >
              <Settings2 size={15} />
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex flex-col md:flex-row flex-1 md:divide-x divide-border overflow-hidden">
          {/* ── Tasks column ── */}
          <section className="flex-1 flex flex-col overflow-y-auto px-6 md:px-10 py-6 md:py-8 border-b md:border-b-0 border-border">
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
                    {tasks.filter((t) => t.status === "finished").length}/
                    {tasks.length}
                  </span>
                )}
              </div>

              {/* Add task button */}
              <button
                onClick={() => setShowCreateTask(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all"
              >
                <Plus size={11} />
                Add
              </button>
            </div>

            {tasks.length === 0 ? (
              <EmptySection
                icon={Circle}
                label="No tasks yet"
                action="+ Add your first task"
                onAction={() => setShowCreateTask(true)}
              />
            ) : (
              <div className="flex flex-col">
                {tasks.map((t, i) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    index={i}
                    isDragging={draggingTask === t.id}
                    dragHandlers={{
                      onDragStart: (idx) => {
                        setDraggingTask(t.id);
                        taskDrag.dragHandlers.onDragStart(idx);
                      },
                      onDragEnter: taskDrag.dragHandlers.onDragEnter,
                      onDragEnd: () => {
                        setDraggingTask(null);
                        taskDrag.dragHandlers.onDragEnd();
                      },
                    }}
                    onToggle={toggleTask}
                    onOpenSettings={setTaskSettings}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Notes column ── */}
          <section className="flex-1 flex flex-col overflow-y-auto px-6 md:px-10 py-6 md:py-8">
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
                onClick={() => setShowCreateNote(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all"
              >
                <Plus size={11} />
                Add
              </button>
            </div>
            {notes.length === 0 ? (
              <EmptySection
                icon={Inbox}
                label="No notes yet"
                action="+ Add your first note"
                onAction={() => setShowCreateNote(true)}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {notes.map((n, i) => (
                  <NoteItem
                    key={n.id}
                    note={n}
                    index={i}
                    isDragging={draggingNote === n.id}
                    dragHandlers={{
                      onDragStart: (idx) => {
                        setDraggingNote(n.id);
                        noteDrag.dragHandlers.onDragStart(idx);
                      },
                      onDragEnter: noteDrag.dragHandlers.onDragEnter,
                      onDragEnd: () => {
                        setDraggingNote(null);
                        noteDrag.dragHandlers.onDragEnd();
                      },
                    }}
                    onOpenSettings={setNoteSettings}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Dialogs ── */}
      {showDaySettings && (
        <DaySettingsDialog
          data={data}
          onClose={() => setShowDaySettings(false)}
          onUpdated={(u) => setData((p) => ({ ...p, ...u }))}
          onDeleted={() => navigate("/")}
        />
      )}

      {showCreateTask && (
        <CreateTaskDialog
          dayId={data.id}
          onClose={() => setShowCreateTask(false)}
          onCreated={addTask}
        />
      )}

      {taskSettings && (
        <TaskSettingsDialog
          task={taskSettings}
          onClose={() => setTaskSettings(null)}
          onUpdated={patchTask}
          onDeleted={removeTask}
        />
      )}

      {showCreateNote && (
        <CreateNoteDialog
          dayId={data.id}
          onClose={() => setShowCreateNote(false)}
          onCreated={addNote}
        />
      )}

      {noteSettings && (
        <NoteSettingsDialog
          note={noteSettings}
          onClose={() => setNoteSettings(null)}
          onUpdated={patchNote}
          onDeleted={removeNote}
        />
      )}
    </>
  );
}
