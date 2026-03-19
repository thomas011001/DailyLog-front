import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validation";
import { AuthLayout, DecorativeColumn } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";

// ─── Decorative left column (Login-specific) ──────────────────────────────────

const LoginDecorativeColumn = () => {
  const now = new Date();
  const dayNum = now.toLocaleDateString("en-US", { day: "2-digit" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const year = now.toLocaleDateString("en-US", { year: "numeric" });

  return (
    <DecorativeColumn>
      <div className="flex flex-col">
        {/* Huge day number */}
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
    </DecorativeColumn>
  );
};

// ─── Login ────────────────────────────────────────────────────────────────────

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

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Already authenticated → go home
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
    <AuthLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      decorative={<LoginDecorativeColumn />}
    >
      {/* Heading */}
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
        <AuthField
          id="username"
          label="Username"
          placeholder="your username"
          Icon={User}
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          error={fieldErrors.username}
        />
        <AuthField
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </AuthLayout>
  );
}
