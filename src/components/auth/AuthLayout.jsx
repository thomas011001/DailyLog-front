/**
 * AuthLayout — two-column layout shared by Login and SignUp.
 *
 * Props:
 *   decorative — ReactNode  (left column content)
 *   children   — ReactNode  (right column: form)
 *   theme      — "light" | "dark"
 *   onToggleTheme — () => void
 */

import { Sun, Moon } from "lucide-react";

// ─── Theme toggle button ──────────────────────────────────────────────────────

export const ThemeBtn = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm z-10"
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
  >
    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
  </button>
);

// ─── Brand mark (reused in both columns on mobile/desktop) ───────────────────

export const BrandMark = () => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      Daily Log
    </span>
    <div className="w-8 h-0.5 bg-primary rounded-full" />
  </div>
);

// ─── AuthLayout ───────────────────────────────────────────────────────────────

export const AuthLayout = ({ decorative, children, theme, onToggleTheme }) => (
  <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
    <ThemeBtn theme={theme} onToggle={onToggleTheme} />

    {/* Left — decorative panel */}
    <div className="md:w-[360px] shrink-0">{decorative}</div>

    {/* Right — form */}
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Mobile brand (hidden on md+) */}
        <div className="md:hidden">
          <BrandMark />
        </div>
        {children}
      </div>
    </div>
  </div>
);

// ─── Shared left column base ──────────────────────────────────────────────────

export const DecorativeColumn = ({ children }) => (
  <div className="hidden md:flex flex-col justify-between h-full px-12 py-14 border-r border-border bg-muted/30 select-none">
    <BrandMark />
    {children}
    <span className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">
      Your productivity journal
    </span>
  </div>
);
