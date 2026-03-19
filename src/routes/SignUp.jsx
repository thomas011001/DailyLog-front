import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Key, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateSignUpForm } from "../utils/validation";
import { AuthLayout, DecorativeColumn } from "../components/auth/AuthLayout";
import { AuthField } from "../components/auth/AuthField";

// ─── Decorative left column (SignUp-specific) ──────────────────────────────────

const SignUpDecorativeColumn = () => {
  const steps = [
    { num: "01", label: "Create your account" },
    { num: "02", label: "Start a new day" },
    { num: "03", label: "Add tasks & notes" },
    { num: "04", label: "Stay consistent" },
  ];

  return (
    <DecorativeColumn>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-foreground">Get started</h2>
          <p className="text-sm text-muted-foreground">
            Four steps to a better day.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map(({ num, label }, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-black tabular-nums text-primary/60 w-5 shrink-0">
                {num}
              </span>
              <div className="w-px h-4 bg-border shrink-0" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </DecorativeColumn>
  );
};

// ─── SignUp ───────────────────────────────────────────────────────────────────

export function SignUp() {
  const navigate = useNavigate();
  const { error: authError, signup, loading, token } = useAuth();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

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
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateSignUpForm(formData);
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({ username: "", password: "", repeatPassword: "" });
    setSuccessMessage("");
    signup({
      username: formData.username.trim(),
      password: formData.password,
      repeatPassword: formData.repeatPassword,
    });
  };

  return (
    <AuthLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      decorative={<SignUpDecorativeColumn />}
    >
      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Plan your days and track your progress.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          id="username"
          label="Username"
          placeholder="your handle"
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
          placeholder="at least 8 characters"
          Icon={Lock}
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          error={fieldErrors.password}
        />
        <AuthField
          id="repeatPassword"
          label="Repeat Password"
          type="password"
          placeholder="type it again"
          Icon={Key}
          value={formData.repeatPassword}
          onChange={handleChange}
          disabled={loading}
          error={fieldErrors.repeatPassword}
        />

        {/* Success Message */}
        {successMessage && (
          <div className="px-3 py-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={13} />
            {successMessage}
          </div>
        )}

        {/* Auth Error */}
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
              <Loader2 size={14} className="animate-spin" /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-primary font-medium underline-offset-4 hover:underline transition-all"
        >
          Log in
        </a>
      </p>
    </AuthLayout>
  );
}
