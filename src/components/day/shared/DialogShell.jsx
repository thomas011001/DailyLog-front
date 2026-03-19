import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * DialogShell — reusable modal container used by all Day dialogs.
 *
 * Props:
 *   title       — string
 *   icon        — Lucide icon component
 *   accentClass — Tailwind gradient class for the top strip (default: "via-primary")
 *   onClose     — () => void
 *   children    — ReactNode
 */
export const DialogShell = ({
  title,
  icon: Icon,
  accentClass = "via-primary",
  onClose,
  children,
}) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Top accent strip */}
        <div
          className={`h-0.5 w-full bg-gradient-to-r from-transparent ${accentClass} to-transparent`}
        />

        {/* Header */}
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
