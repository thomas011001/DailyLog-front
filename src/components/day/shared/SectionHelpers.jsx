/* eslint-disable no-unused-vars */
/**
 * EmptySection — shown when a list (tasks / notes) is empty.
 *
 * Props:
 *   icon     — Lucide icon component
 *   label    — string
 *   action   — string (optional CTA text)
 *   onAction — () => void
 */
export const EmptySection = ({ icon: Icon, label, action, onAction }) => (
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

/**
 * TaskProgress — thin progress bar + count shown in the DayHeader.
 *
 * Props:
 *   tasks — TaskOut[]
 */
export const TaskProgress = ({ tasks = [] }) => {
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
