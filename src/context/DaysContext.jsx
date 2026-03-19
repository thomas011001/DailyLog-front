import { createContext, useContext, useState, useCallback } from "react";
import { useDay } from "../hooks/useDay";

// ─── Context ──────────────────────────────────────────────────────────────────

const DaysContext = createContext(null);

const useDays = () => {
  const ctx = useContext(DaysContext);
  if (!ctx) throw new Error("useDays must be used within <DaysProvider>");
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const DaysProvider = ({ children }) => {
  const { days: fetchDays } = useDay();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDays();
      setData(result);
      return result;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new day to the list
  const addDay = useCallback((day) => {
    setData((prev) => (prev ? [day, ...prev] : [day]));
  }, []);

  // Update a day in the list
  const editDay = useCallback((updated) => {
    setData((prev) =>
      prev?.map((d) =>
        String(d.id) === String(updated.id) ? { ...d, ...updated } : d,
      ),
    );
  }, []);

  // Remove a day from the list
  const removeDay = useCallback((id) => {
    setData((prev) => prev?.filter((d) => String(d.id) !== String(id)));
  }, []);

  return (
    <DaysContext.Provider
      value={{ data, loading, error, load, addDay, editDay, removeDay }}
    >
      {children}
    </DaysContext.Provider>
  );
};
