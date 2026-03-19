/**
 * Field — labeled input / textarea used across Day dialogs and forms.
 *
 * Props:
 *   id          — string
 *   label       — string
 *   type        — input type (default "text")
 *   as          — "input" | "textarea"
 *   value       — string
 *   onChange    — (e) => void
 *   disabled    — boolean
 *   Icon        — Lucide icon component
 *   placeholder — string
 *   rows        — number (textarea only, default 3)
 */
export const Field = ({
  id,
  label,
  type = "text",
  as = "input",
  value,
  onChange,
  disabled,
  Icon,
  placeholder,
  rows = 3,
}) => {
  const sharedClass =
    "w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground " +
    "placeholder:text-foreground/30 " +
    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
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
          rows={rows}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={sharedClass}
        />
      )}
    </div>
  );
};
