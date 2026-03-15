import { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Settings,
  X,
  ChevronRight,
  Bell,
  BellOff,
  Trash2,
  Coffee,
  Brain,
  Zap,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "pomodoro_state";

const MODES = {
  work: {
    label: "Focus",
    short: "FOCUS",
    icon: Brain,
    accent: "var(--primary)",
  },
  short: {
    label: "Short Break",
    short: "BREAK",
    icon: Coffee,
    accent: "#10b981",
  },
  long: {
    label: "Long Break",
    short: "RECHARGE",
    icon: Zap,
    accent: "#60a5fa",
  },
};

const DEFAULT_SETTINGS = {
  work: 25,
  short: 5,
  long: 15,
  sessionsUntilLong: 4,
};

const DEFAULT_STATE = {
  mode: "work",
  timeLeft: DEFAULT_SETTINGS.work * 60,
  session: 1,
  completed: 0,
  settings: DEFAULT_SETTINGS,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");
const fmtTime = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
};

const saveState = (s) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
};

// ─── Ring progress ────────────────────────────────────────────────────────────

const Ring = ({ pct, accent }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <svg
      width="140"
      height="140"
      className="absolute inset-0 -rotate-90"
      style={{ filter: `drop-shadow(0 0 8px ${accent}44)` }}
    >
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-border"
        strokeWidth="3.5"
      />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        style={{
          transition: "stroke-dashoffset 0.6s linear, stroke 0.4s ease",
        }}
      />
    </svg>
  );
};

// ─── Session dots ─────────────────────────────────────────────────────────────

const SessionDots = ({ completed, total, accent, onClear }) => {
  const filled =
    completed % total || (completed > 0 && completed % total === 0 ? total : 0);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full border transition-all duration-500"
              style={{
                borderColor: i < filled ? accent : "var(--border)",
                background: i < filled ? accent : "transparent",
                boxShadow: i < filled ? `0 0 6px ${accent}99` : "none",
              }}
            />
          ))}
        </div>
        {completed > 0 && (
          <button
            onClick={onClear}
            title="Clear sessions"
            className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
      <span className="text-[11px] text-muted-foreground tabular-nums">
        {completed} session{completed !== 1 ? "s" : ""} completed
      </span>
    </div>
  );
};

// ─── Settings panel ───────────────────────────────────────────────────────────

const SettingsPanel = ({ settings, onChange, onClose }) => (
  <div className="flex flex-col gap-5 px-6 py-5">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold">Settings</span>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={15} />
      </button>
    </div>
    {[
      { key: "work", label: "Focus", unit: "min" },
      { key: "short", label: "Short Break", unit: "min" },
      { key: "long", label: "Long Break", unit: "min" },
      { key: "sessionsUntilLong", label: "Sessions per cycle", unit: "" },
    ].map(({ key, label, unit }) => (
      <div key={key} className="flex items-center justify-between">
        <label className="text-sm text-muted-foreground">{label}</label>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onChange(key, Math.max(1, settings[key] - 1))}
            className="w-6 h-6 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm font-medium"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">
            {settings[key]}
            {unit}
          </span>
          <button
            onClick={() => onChange(key, Math.min(60, settings[key] + 1))}
            className="w-6 h-6 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm font-medium"
          >
            +
          </button>
        </div>
      </div>
    ))}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export const PomodoroTimer = () => {
  const saved = loadState();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mode, setMode] = useState(saved.mode);
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft);
  const [session, setSession] = useState(saved.session);
  const [completed, setCompleted] = useState(saved.completed);
  const [settings, setSettings] = useState(saved.settings ?? DEFAULT_SETTINGS);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const modeData = MODES[mode];
  const accent = modeData.accent;
  const totalTime =
    settings[mode === "work" ? "work" : mode === "short" ? "short" : "long"] *
    60;
  const pct = Math.max(0, 1 - timeLeft / totalTime);

  // ── Persist ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    saveState({ mode, timeLeft, session, completed, settings });
  }, [mode, timeLeft, session, completed, settings]);

  // ── Beep ──────────────────────────────────────────────────────────────────────
  const beep = useCallback(() => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [880, 1100, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        const t = ctx.currentTime + i * 0.2;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    } catch {}
  }, [muted]);

  // ── Tick ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            beep();
            advanceSession();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  // ── Advance session ────────────────────────────────────────────────────────────
  const advanceSession = useCallback(() => {
    setCompleted((c) => c + 1);
    setSession((s) => {
      const next = s + 1;
      if (mode === "work") {
        doSwitchMode(next > settings.sessionsUntilLong ? "long" : "short");
        return next > settings.sessionsUntilLong ? 1 : next;
      }
      doSwitchMode("work");
      return next;
    });
  }, [mode, settings]);

  const doSwitchMode = (m) => {
    const mins =
      m === "work"
        ? settings.work
        : m === "short"
          ? settings.short
          : settings.long;
    setMode(m);
    setTimeLeft(mins * 60);
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(
      settings[mode === "work" ? "work" : mode === "short" ? "short" : "long"] *
        60,
    );
  };

  const clearSessions = () => {
    setCompleted(0);
    setSession(1);
  };

  const handleSettingsChange = (key, val) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      if (!running) {
        setTimeLeft(
          settings[
            mode === "work" ? "work" : mode === "short" ? "short" : "long"
          ] * 60,
        );
      }
      return next;
    });
  };

  const ModeIcon = modeData.icon;

  // ─── Collapsed tab ─────────────────────────────────────────────────────────────
  const CollapsedTab = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="flex flex-col items-center justify-center gap-2 w-full h-full py-4 group"
    >
      <ChevronRight
        size={11}
        className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
      />
      <ModeIcon
        size={13}
        style={{ color: running ? accent : "var(--muted-foreground)" }}
        className="transition-colors duration-300"
      />
      <span
        className="text-[9px] font-mono font-bold tabular-nums [writing-mode:vertical-rl] rotate-180 tracking-widest"
        style={{ color: running ? accent : "var(--muted-foreground)" }}
      >
        {fmtTime(timeLeft)}
      </span>
      {running && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: accent }}
        />
      )}
    </button>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Collapsed strip */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40
        bg-card border border-border border-r-0 rounded-l-2xl
        transition-all duration-300 overflow-hidden
        ${isOpen ? "opacity-0 pointer-events-none w-0 h-0" : "opacity-100 h-32 w-9"}`}
        style={{
          boxShadow: running
            ? `0 0 24px ${accent}44, 0 2px 16px rgba(0,0,0,.08)`
            : "0 2px 16px rgba(0,0,0,.08)",
        }}
      >
        <CollapsedTab />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full z-50 flex flex-col w-72 bg-card border-l border-border
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ boxShadow: `-8px 0 40px ${accent}18` }}
      >
        {/* Top glow strip */}
        <div
          className="h-0.5 shrink-0 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ModeIcon
              size={14}
              style={{ color: accent }}
              className="transition-colors duration-300"
            />
            <span className="text-sm font-semibold text-foreground">
              Pomodoro
            </span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-all duration-300"
              style={{ background: `${accent}18`, color: accent }}
            >
              {modeData.short}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setMuted((m) => !m)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {muted ? <BellOff size={13} /> : <Bell size={13} />}
            </button>
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Settings size={13} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Body */}
        {showSettings ? (
          <SettingsPanel
            settings={settings}
            onChange={handleSettingsChange}
            onClose={() => setShowSettings(false)}
          />
        ) : (
          <div className="flex flex-col flex-1 items-center justify-between px-6 py-6 overflow-y-auto">
            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-muted/60 w-full">
              {Object.entries(MODES).map(
                ([key, { label, icon: Icon, accent: a }]) => (
                  <button
                    key={key}
                    onClick={() => doSwitchMode(key)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all duration-200
                    ${mode === key ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    style={mode === key ? { color: a } : {}}
                  >
                    <Icon size={12} />
                    {label.split(" ")[0]}
                  </button>
                ),
              )}
            </div>

            {/* Ring */}
            <div className="relative w-[140px] h-[140px] flex items-center justify-center my-3">
              <Ring pct={pct} accent={accent} />
              <div className="flex flex-col items-center z-10 gap-0.5">
                <span
                  className="text-[2.6rem] font-black font-mono tabular-nums leading-none transition-colors duration-300"
                  style={{ color: accent }}
                >
                  {fmtTime(timeLeft)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {modeData.label}
                </span>
              </div>
            </div>

            {/* Sessions */}
            <SessionDots
              completed={completed}
              total={settings.sessionsUntilLong}
              accent={accent}
              onClear={clearSessions}
            />

            {/* Controls */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={reset}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-95"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={() => setRunning((r) => !r)}
                className="w-16 h-16 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: accent,
                  boxShadow: `0 4px 24px ${accent}66`,
                }}
              >
                {running ? (
                  <Pause size={24} fill="white" />
                ) : (
                  <Play size={24} fill="white" className="translate-x-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  setRunning(false);
                  advanceSession();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-95"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Bottom glow strip */}
        <div
          className="h-0.5 shrink-0 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
          }}
        />
      </div>
    </>
  );
};
