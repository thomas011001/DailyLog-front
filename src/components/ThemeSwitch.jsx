import { Moon, Sun } from "lucide-react";

export function ThemeSwitch({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 border rounded bg-input text-foreground hover:bg-card transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
