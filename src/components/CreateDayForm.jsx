import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Type, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDay } from "../hooks/useDay";
import { DialogBody, DialogFooter, DialogHeader } from "./Dialog";
import { useDays } from "../context/DaysContext";

// ─── Quick date shortcuts ─────────────────────────────────────────────────────

const today = () => new Date().toISOString().split("T")[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const SHORTCUTS = [
  { label: "Yesterday", value: yesterday },
  { label: "Today", value: today },
  { label: "Tomorrow", value: tomorrow },
];

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  Icon,
  placeholder,
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/60"
    >
      {Icon && <Icon size={10} className="text-foreground/60" />}
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground
        placeholder:text-foreground/30
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all
        disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

// ─── CreateDayForm ────────────────────────────────────────────────────────────

export function CreateDayForm({ onClose }) {
  const navigate = useNavigate();
  const { createDay, loading } = useDay();
  const { addDay } = useDays();

  const [fields, setFields] = useState({ title: "", date: today() });

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const day = await createDay(fields);
      toast.success("Day created!");
      addDay(day);
      onClose?.();
      navigate(`/day/${day.id}`);
    } catch (err) {
      toast.error(err.message ?? "Something went wrong, please try again.");
    }
  };

  const isToday = fields.date === today();

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">New Day</h2>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Start fresh — add a title and pick a date.
        </p>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-5">
        {/* Title */}
        <Field
          id="day-title"
          label="Title"
          Icon={Type}
          placeholder="Give this day a name (optional)"
          value={fields.title}
          onChange={set("title")}
          disabled={loading}
        />

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Field
            id="day-date"
            label="Date"
            type="date"
            Icon={CalendarDays}
            value={fields.date}
            onChange={set("date")}
            disabled={loading}
          />

          {/* Quick shortcuts */}
          <div className="flex gap-1.5">
            {SHORTCUTS.map(({ label, value }) => {
              const val = value();
              const active = fields.date === val;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFields((p) => ({ ...p, date: val }))}
                  disabled={loading}
                  className={`flex-1 py-1 rounded-md text-[11px] font-medium border transition-all
                    ${
                      active
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "border-border text-foreground/40 hover:text-foreground/70 hover:border-border/80"
                    } disabled:opacity-50`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        {fields.date && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/40 border border-border/60">
            <div className="flex flex-col items-center w-8 shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground leading-none">
                {new Date(fields.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </span>
              <span className="text-xl font-black leading-tight text-foreground">
                {new Date(fields.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                })}
              </span>
            </div>
            <div className="w-px h-8 bg-border shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {fields.title.trim() || (
                  <span className="italic text-muted-foreground">Untitled</span>
                )}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {new Date(fields.date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
                {isToday && (
                  <span className="ml-1.5 text-[10px] font-semibold text-primary">
                    · Today
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs text-foreground/50 hover:text-foreground hover:bg-accent transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Creating...
            </>
          ) : (
            <>
              <Plus size={12} /> Create Day
            </>
          )}
        </button>
      </DialogFooter>
    </form>
  );
}
