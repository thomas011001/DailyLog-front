/**
 * AuthField — labeled input with optional password toggle and error hint.
 * Shared between Login and SignUp to eliminate code duplication.
 *
 * Props:
 *   id          — string
 *   label       — string
 *   type        — input type (default "text")
 *   placeholder — string
 *   Icon        — Lucide icon
 *   value       — string
 *   onChange    — (e) => void
 *   disabled    — boolean
 *   error       — string
 */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const AuthField = ({
  id,
  label,
  type = "text",
  placeholder,
  Icon,
  value,
  onChange,
  disabled,
  error,
}) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPw ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {Icon && <Icon size={11} />}
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={[
            "w-full px-3 py-2.5 text-sm bg-background border rounded-lg",
            "text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-destructive focus:ring-destructive/20"
              : "border-border",
          ].join(" ")}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors disabled:opacity-30"
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
};
