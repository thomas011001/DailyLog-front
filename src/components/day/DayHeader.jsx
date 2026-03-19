import { Settings2 } from "lucide-react";
import { TaskProgress } from "./shared/SectionHelpers";

/**
 * Formats a date string into display parts.
 * @param {string} dateStr — "YYYY-MM-DD"
 */
// eslint-disable-next-line react-refresh/only-export-components
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    dayNum: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "long" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    year: d.toLocaleDateString("en-US", { year: "numeric" }),
    isToday: new Date().toDateString() === d.toDateString(),
  };
};

/**
 * DayHeader — large date display at the top of the DayPage.
 *
 * Props:
 *   data            — DayOut (id, title, date)
 *   tasks           — TaskOut[]  (used for progress bar)
 *   onOpenSettings  — () => void
 */
export const DayHeader = ({ data, tasks, onOpenSettings }) => {
  const { dayNum, month, weekday, year, isToday } = formatDate(data.date);

  return (
    <header className="px-6 md:px-10 pt-8 md:pt-10 pb-6 border-b border-border shrink-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Weekday + Today badge */}
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                Today
              </span>
            )}
            <span className="text-xs text-muted-foreground tracking-wider uppercase">
              {weekday}
            </span>
          </div>

          {/* Big date number + month/year + optional title */}
          <div className="flex items-end gap-4 flex-wrap">
            <span
              className="font-black leading-none text-foreground select-none"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              {dayNum}
            </span>
            <div className="flex flex-col pb-2">
              <span className="text-xl font-semibold text-foreground">
                {month}
              </span>
              <span className="text-sm text-muted-foreground">{year}</span>
            </div>
            {data.title && (
              <>
                <div className="w-px h-10 bg-border self-center" />
                <h1 className="text-xl font-medium text-foreground pb-1 self-end truncate max-w-[200px]">
                  {data.title}
                </h1>
              </>
            )}
          </div>

          {/* Progress bar */}
          <TaskProgress tasks={tasks} />
        </div>

        {/* Day settings button */}
        <button
          onClick={onOpenSettings}
          className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-foreground/50 hover:text-foreground hover:bg-accent transition-colors shrink-0"
        >
          <Settings2 size={15} />
        </button>
      </div>
    </header>
  );
};
