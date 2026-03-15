import { Sun, Moon, LogOut, User } from "lucide-react";
import { DialogBody, DialogFooter, DialogHeader } from "./Dialog";
import { useDialog } from "./Dialog";

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ label, children }) => (
  <div className="flex flex-col gap-3">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
    {children}
  </div>
);

// ─── Theme toggle ─────────────────────────────────────────────────────────────

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === "dark";
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/40">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center">
          {isDark ? (
            <Moon size={13} className="text-blue-400" />
          ) : (
            <Sun size={13} className="text-amber-400" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {isDark ? "Dark" : "Light"} Mode
          </span>
          <span className="text-[11px] text-muted-foreground">
            {isDark ? "Easy on the eyes" : "Bright and clear"}
          </span>
        </div>
      </div>

      {/* Toggle pill */}
      <button
        onClick={onToggle}
        className="relative shrink-0 rounded-full border border-border transition-colors duration-300"
        style={{
          width: "40px",
          height: "22px",
          background: isDark ? "var(--primary)" : "var(--muted)",
        }}
      >
        <span
          className="absolute top-[2.5px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
          style={{
            transform: isDark ? "translateX(-19px)" : "translateX(3px)",
          }}
        />
      </button>
    </div>
  );
};

// ─── Account row ──────────────────────────────────────────────────────────────

const AccountRow = ({ username }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/40">
    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
      <User size={15} className="text-primary" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold truncate">@{username}</span>
      <span className="text-[11px] text-muted-foreground">Your account</span>
    </div>
  </div>
);

// ─── Settings dialog content ──────────────────────────────────────────────────

export const SettingsDialogContent = ({
  username,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const { close } = useDialog();

  const handleLogout = () => {
    close();
    onLogout?.();
  };

  return (
    <>
      <DialogHeader>
        <h2 className="text-base font-semibold">Settings</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Manage your account and preferences
        </p>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-6">
        <Section label="Account">
          <AccountRow username={username} />
        </Section>

        <Section label="Appearance">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </Section>
      </DialogBody>

      <DialogFooter className="justify-between">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={14} />
          Log out
        </button>
        <button
          onClick={close}
          className="px-4 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </DialogFooter>
    </>
  );
};
