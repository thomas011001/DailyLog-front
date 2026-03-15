import { useState, useCallback } from "react";

const TOKEN_KEY = "auth_token";

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * useTask — hook for Task resource endpoints
 *
 * Provides:
 *   createTask({ day_id, title, description?, priority?, remind_at? }) → POST   /tasks
 *   updateTask(task_id, { title?, description?, priority?, remind_at? }) → PUT  /tasks/:task_id
 *   deleteTask(task_id)                                                  → DELETE /tasks/:task_id
 */
export function useTask({ baseUrl = "http://127.0.0.1:8000" } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function request(method, endpoint, body) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: authHeaders(),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });

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

  /**
   * createTask({ day_id, title, description?, priority?, remind_at? })
   * remind_at → ISO 8601 string e.g. "2025-05-05T12:00:00"
   * Returns TaskOut: { id, title, description, priority, remind_at }
   */
  const createTask = useCallback(
    ({ day_id, title, description, priority, remind_at }) =>
      request("POST", "/tasks", {
        day_id,
        title,
        description,
        priority,
        remind_at,
      }),
    [],
  );

  /**
   * updateTask(task_id, { title?, description?, priority?, remind_at? })
   * Partial update — only provided fields are changed.
   * Returns updated TaskOut.
   */
  const updateTask = useCallback(
    (task_id, { title, description, priority, remind_at } = {}) =>
      request("PUT", `/tasks/${task_id}`, {
        title,
        description,
        priority,
        remind_at,
      }),
    [],
  );

  /**
   * deleteTask(task_id)
   * Returns { detail: "Task deleted." }
   */
  const deleteTask = useCallback(
    (task_id) => request("DELETE", `/tasks/${task_id}`),
    [],
  );

  return {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
