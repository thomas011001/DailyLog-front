import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Loader2, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validation";

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
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
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

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
          className={`w-full px-3 py-2.5 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-destructive focus:ring-destructive/20" : "border-border"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors disabled:opacity-30"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-destructive flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Theme toggle button ──────────────────────────────────────────────────────

const ThemeBtn = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm"
  >
    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
  </button>
);

// ─── Decorative date column ───────────────────────────────────────────────────

const DateColumn = () => {
  const now = new Date();
  const dayNum = now.toLocaleDateString("en-US", { day: "2-digit" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const year = now.toLocaleDateString("en-US", { year: "numeric" });

  return (
    <div className="hidden md:flex flex-col justify-between h-full px-12 py-14 border-r border-border bg-muted/30 select-none">
      {/* Brand */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Daily Log
        </span>
        <div className="w-8 h-0.5 bg-primary rounded-full" />
      </div>

      {/* Big date */}
      <div className="flex flex-col">
        <span className="text-[7rem] font-black leading-none text-foreground/10 select-none">
          {dayNum}
        </span>
        <div className="flex flex-col gap-0.5 -mt-2">
          <span className="text-2xl font-bold text-foreground">{month}</span>
          <span className="text-sm text-muted-foreground">
            {weekday}, {year}
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {["Plan your day.", "Track your tasks.", "Reflect and grow."].map(
            (t, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-sm text-muted-foreground/70"
              >
                <div className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                {t}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Bottom label */}
      <span className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">
        Your productivity journal
      </span>
    </div>
  );
};

// ─── Login page ───────────────────────────────────────────────────────────────

export function Login() {
  const navigate = useNavigate();
  const { error: authError, login, loading, token } = useAuth();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) setFieldErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateLoginForm(formData);
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({ username: "", password: "" });
    login({ username: formData.username.trim(), password: formData.password });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <ThemeBtn theme={theme} onToggle={toggleTheme} />

      {/* Left — decorative */}
      <div className="md:w-[360px] shrink-0">
        <DateColumn />
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          {/* Mobile brand */}
          <div className="flex flex-col gap-1 md:hidden">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Daily Log
            </span>
            <div className="w-8 h-0.5 bg-primary rounded-full" />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Log in to continue your daily journey.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              id="username"
              label="Username"
              placeholder="your username"
              Icon={User}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              error={fieldErrors.username}
            />
            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="your password"
              Icon={Lock}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={fieldErrors.password}
            />

            {/* Auth error */}
            {authError && (
              <div className="px-3 py-2.5 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-xs">
                {authError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                flex items-center justify-center gap-2
                hover:opacity-90 active:scale-[0.98] transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-primary font-medium underline-offset-4 hover:underline transition-all"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
