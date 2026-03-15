import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDays } from "../context/DaysContext";
import { useDay } from "../hooks/useDay";
import { toast } from "sonner";

const todayStr = () => new Date().toISOString().split("T")[0];

const findClosest = (days) => {
  const todayMs = new Date(todayStr()).getTime();
  return days.reduce((best, day) => {
    const bestDiff = Math.abs(new Date(best.date).getTime() - todayMs);
    const dayDiff = Math.abs(new Date(day.date).getTime() - todayMs);
    return dayDiff < bestDiff ? day : best;
  });
};

export function Home() {
  const navigate = useNavigate();
  const { data, load, addDay } = useDays();
  const { createDay } = useDay();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      let days = data;

      // Load if not cached yet
      if (!days) {
        try {
          days = await load();
        } catch {
          // Auth error etc — Main's useEffect will handle redirect to login
          return;
        }
      }

      // Has days → go to today or closest
      if (Array.isArray(days) && days.length > 0) {
        const exact = days.find((d) => d.date === todayStr());
        const target = exact ?? findClosest(days);
        navigate(`/day/${target.id}`, { replace: true });
        return;
      }

      // No days → create today
      try {
        const day = await createDay({ title: "Today", date: todayStr() });
        addDay(day);
        navigate(`/day/${day.id}`, { replace: true });
        toast.success("Created a new day for today!");
      } catch {
        // Silently fail — auth redirect will handle it if needed
      }
    };

    run();
  }, []);

  return null;
}
