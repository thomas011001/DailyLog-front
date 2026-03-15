import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Settings, Plus } from "lucide-react";
import Sidebar, {
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "../components/SideBar";
import { Button } from "../components/Button";
import { DayList } from "../components/DayList";
import { UserInfo } from "../components/UserInfo";
import { SettingsDialogContent } from "../components/SettingsDialogContent";
import { DaysProvider } from "../context/DaysContext";
import Dialog, {
  DialogContent,
  DialogTrigger,
  useDialog,
} from "../components/Dialog";
import { CreateDayForm } from "../components/CreateDayForm";
import { PomodoroTimer } from "../components/PomodoroTimer";

// ─── Settings dialog wrapper ──────────────────────────────────────────────────

const SettingsDialogWrapper = ({
  username,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const { close } = useDialog();
  return (
    <DialogContent className="max-w-sm">
      <SettingsDialogContent
        username={username}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={() => {
          close();
          onLogout();
        }}
      />
    </DialogContent>
  );
};

// ─── Create day dialog wrapper ────────────────────────────────────────────────

const CreateDayDialogContent = () => {
  const { close } = useDialog();
  return (
    <DialogContent>
      <CreateDayForm onClose={close} />
    </DialogContent>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────

export function Main() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });

  // Apply theme on <html> so Portals (dialogs) inherit it too
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!token) navigate("/signup");
  }, [token, navigate]);

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <DaysProvider>
      <div className="h-dvh flex">
        <Sidebar>
          {/* ── Header ── */}
          <SidebarHeader className="justify-between">
            <UserInfo username={user?.username} />

            <Dialog>
              <DialogTrigger>
                <button className="float-right w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0">
                  <Settings size={15} />
                </button>
              </DialogTrigger>
              <SettingsDialogWrapper
                username={user?.username}
                theme={theme}
                onToggleTheme={toggleTheme}
                onLogout={handleLogout}
              />
            </Dialog>
          </SidebarHeader>

          {/* ── Days ── */}
          <SidebarContent className="p-0!">
            <DayList />
          </SidebarContent>

          {/* ── Footer ── */}
          <SidebarFooter>
            <Dialog>
              <DialogTrigger className="w-full">
                <Button className="flex items-center justify-center gap-2">
                  <Plus size={15} />
                  New Day
                </Button>
              </DialogTrigger>
              <CreateDayDialogContent />
            </Dialog>
          </SidebarFooter>
        </Sidebar>

        {/* ── Content ── */}
        <main className="flex-1 bg-background overflow-y-auto">
          <Outlet />
        </main>

        {/* ── Pomodoro ── */}
        <PomodoroTimer />
      </div>
    </DaysProvider>
  );
}
