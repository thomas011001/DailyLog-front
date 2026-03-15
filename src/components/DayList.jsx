import { useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDays } from "../context/DaysContext";
// ─── DayItem ──────────────────────────────────────────────────────────────────

const DayItem = ({ id, title, date }) => {
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const isActive = String(activeId) === String(id);

  const d = new Date(date);
  const dayNum = d.toLocaleDateString("en-US", { day: "2-digit" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const isToday = new Date().toDateString() === d.toDateString();

  return (
    <div
      onClick={() => navigate(`/day/${id}`)}
      className={`group relative flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b border-sidebar-border transition-colors
        ${isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"}
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />
      )}

      {/* Date badge */}
      <div className="flex flex-col items-center justify-center w-9 shrink-0">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground leading-none">
          {month}
        </span>
        <span
          className={`text-lg font-bold leading-tight ${isActive ? "text-primary" : "text-sidebar-foreground"}`}
        >
          {dayNum}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-sidebar-border shrink-0" />

      {/* Title + weekday */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={`text-sm font-medium truncate ${isActive ? "text-sidebar-foreground" : "text-sidebar-foreground"}`}
        >
          {title?.trim() || (
            <span className="italic text-muted-foreground">Untitled</span>
          )}
        </span>
        <span className="text-[11px] text-muted-foreground">{weekday}</span>
      </div>

      {/* Today badge */}
      {isToday && (
        <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
          Today
        </span>
      )}
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const DayItemSkeleton = () => (
  <div className="flex items-center gap-3 px-3 py-2.5 border-b border-sidebar-border animate-pulse">
    <div className="flex flex-col items-center gap-1 w-9">
      <div className="h-2 w-5 rounded bg-muted" />
      <div className="h-5 w-7 rounded bg-muted" />
    </div>
    <div className="w-px h-8 bg-sidebar-border shrink-0" />
    <div className="flex flex-col gap-1.5 flex-1">
      <div className="h-3 w-3/4 rounded bg-muted" />
      <div className="h-2 w-1/2 rounded bg-muted" />
    </div>
  </div>
);

// ─── DayList ──────────────────────────────────────────────────────────────────

export const DayList = () => {
  const { data, loading, error, load } = useDays();

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col border-t border-sidebar-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <DayItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-destructive">
        <CalendarDays size={28} strokeWidth={1.5} />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
        <CalendarDays size={28} strokeWidth={1.5} />
        <span className="text-sm">No days yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-t border-sidebar-border">
      {[...data]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((day) => (
          <DayItem key={day.id} id={day.id} title={day.title} date={day.date} />
        ))}
    </div>
  );
};
