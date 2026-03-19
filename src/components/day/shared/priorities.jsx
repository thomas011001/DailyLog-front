export const PRIORITIES = {
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

export const PriorityPicker = ({ value = 1, onChange, disabled = false }) => {
  const current = Number(value) || 1;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/60">
        Priority
      </span>
      <div className="flex gap-2">
        {Object.entries(PRIORITIES).map(([k, p]) => {
          const n = Number(k);
          const active = n === current;
          return (
            <button
              key={k}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(n)}
              className={[
                "flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                active ? `${p.bg} ${p.border} ${p.color}` : "border-border",
                !active && "hover:bg-muted/60 hover:border-primary/30",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

