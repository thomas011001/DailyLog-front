import { ThemeSwitch } from "./ThemeSwitch";

export function Card({ children, theme, onThemeToggle }) {
  return (
    <div className="p-8 rounded-lg shadow-lg bg-card text-card-foreground w-full max-w-md transition-colors duration-300 relative">
      {onThemeToggle && (
        <div className="absolute top-4 right-4">
          <ThemeSwitch theme={theme} onToggle={onThemeToggle} />
        </div>
      )}
      {children}
    </div>
  );
}
