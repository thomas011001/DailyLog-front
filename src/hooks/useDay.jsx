import { useState, useCallback } from "react";
import { API_URL_BASE } from "../config/apiBase";

const TOKEN_KEY = "auth_token";

/**
 * useDay — hook for Day resource endpoints
 *
 * Provides:
 *   createDay({ title?, date })          → POST   /day
 *   getDay(id)                           → GET    /day/:id
 *   updateDay(id, { title?, new_date? }) → PUT    /day/:id
 *   deleteDay(id)                        → DELETE /day/:id
 */
export function useDay({
  baseUrl = "https://thomasyacoub-daily-log.hf.space",
} = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── helpers ────────────────────────────────────────────────────────────────

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function authHeaders() {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function request(method, endpoint, body) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: authHeaders(),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });

      // 204 / 200 with no body
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.detail ?? `Request failed (${res.status})`);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // ─── public API ─────────────────────────────────────────────────────────────

  /**
   * createDay({ title?: string, date: string })
   * Creates a new day entry. `date` should be "YYYY-MM-DD".
   * Returns DayOut.
   */
  const createDay = useCallback(
    async ({ title, date }) => await request("POST", "/day", { title, date }),
    [],
  );

  /**
   * getDay(id: number)
   * Fetches a day along with its tasks and notes.
   * Returns DayOut.
   */
  const getDay = useCallback(
    async (id) => await request("GET", `/day/${id}`),
    [],
  );

  /**
   * updateDay(id: number, { title?: string, new_date?: string })
   * Updates title and/or date of an existing day.
   * Returns updated DayOut.
   */
  const updateDay = useCallback(
    async (id, { title, new_date } = {}) =>
      await request("PUT", `/day/${id}`, { title, new_date }),
    [],
  );

  const [data, setData] = useState(null);

  // وضيف الفانكشن
  const days = useCallback(async () => {
    const result = await request("GET", "/me/days");
    setData(result);
    return result;
  }, []);

  /**
   * deleteDay(id: number)
   * Deletes a day by id.
   * Returns { detail: "Day deleted." }
   */
  const deleteDay = useCallback((id) => request("DELETE", `/day/${id}`), []);

  return {
    loading,
    error,
    data,
    createDay,
    getDay,
    updateDay,
    deleteDay,
    days,
  };
}
