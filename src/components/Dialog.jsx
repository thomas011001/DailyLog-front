import { useState, useEffect, createContext, useContext } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

// ─── Context ──────────────────────────────────────────────────────────────────

const DialogContext = createContext(null);

const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within <Dialog>");
  return ctx;
};

// ─── Dialog Sub-Components ────────────────────────────────────────────────────

const DialogTrigger = ({ children, className = "" }) => {
  const { open } = useDialog();
  return (
    <div className={`cursor-pointer ${className}`} onClick={open}>
      {children}
    </div>
  );
};

const DialogContent = ({ children, className = "", theme }) => {
  const { isOpen, close } = useDialog();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={close} />

      {/* Dialog box */}
      <div
        className={`${theme} fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card text-card-foreground shadow-xl ${className}`}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <X size={16} />
        </button>

        {children}
      </div>
    </>,
    document.body,
  );
};

const DialogHeader = ({ children, className = "" }) => {
  return (
    <div className={`px-6 pt-6 pb-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
};

const DialogBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

const DialogFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`px-6 pt-4 pb-6 border-t border-border flex items-center justify-end gap-2 ${className}`}
    >
      {children}
    </div>
  );
};

// ─── Main Dialog Component ────────────────────────────────────────────────────

const Dialog = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      <div className={`inline-block w-full ${className}`}>{children}</div>
    </DialogContext.Provider>
  );
};

export {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  useDialog,
};
export default Dialog;
