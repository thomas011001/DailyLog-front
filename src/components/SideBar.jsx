import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

// ─── Sidebar Sub-Components ───────────────────────────────────────────────────

const SidebarHeader = ({ children, className = "" }) => {
  return (
    <div
      className={`h-16 flex items-center shrink-0 px-4 border-b border-sidebar-border gap-2 ${className}`}
    >
      {children}
    </div>
  );
};

const SidebarContent = ({ children, className = "" }) => {
  return (
    <div className={`flex-1 overflow-y-auto px-4 py-4 ${className}`}>
      {children}
    </div>
  );
};

const SidebarFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`h-16 flex items-center shrink-0 px-5 border-t border-sidebar-border ${className}`}
    >
      {children}
    </div>
  );
};

// ─── Mobile Menu Button ───────────────────────────────────────────────────────

const SidebarTrigger = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-md bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-md ${className}`}
    >
      <Menu size={20} />
    </button>
  );
};

// ─── Main Sidebar Component ───────────────────────────────────────────────────

const Sidebar = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <SidebarTrigger onClick={() => setIsOpen(true)} />

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={[
          "w-[260px] h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          "md:relative md:translate-x-0",
          "fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        ].join(" ")}
      >
        {/* Close button — floats outside sidebar on mobile */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed top-4 left-[268px] z-50 flex items-center justify-center w-8 h-8 rounded-md bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-md transition-colors hover:bg-sidebar-accent"
          >
            <X size={16} />
          </button>
        )}

        {children}
      </aside>
    </>
  );
};

export { SidebarHeader, SidebarContent, SidebarFooter };
export default Sidebar;
