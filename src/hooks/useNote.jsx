import { useState, useCallback } from "react";
import { API_URL_BASE } from "../config/apiBase";

const TOKEN_KEY = "auth_token";

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * useNote — hook for Note resource endpoints
 *
 * Provides:
 *   createNote({ day_id, content })  → POST   /notes
 *   updateNote(note_id, { content }) → PUT    /notes/:note_id
 *   deleteNote(note_id)              → DELETE /notes/:note_id
 */
export function useNote({
  baseUrl = "https://thomasyacoub-daily-log.hf.space",
} = {}) {
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
   * createNote({ day_id, content })
   * Returns NoteOut: { id, content }
   */
  const createNote = useCallback(
    ({ day_id, content }) => request("POST", "/notes", { day_id, content }),
    [],
  );

  /**
   * updateNote(note_id, { content? })
   * Partial update — content is only changed if provided.
   * Returns updated NoteOut.
   */
  const updateNote = useCallback(
    (note_id, { content } = {}) =>
      request("PUT", `/notes/${note_id}`, { content }),
    [],
  );

  /**
   * deleteNote(note_id)
   * Returns { detail: "Note deleted." }
   */
  const deleteNote = useCallback(
    (note_id) => request("DELETE", `/notes/${note_id}`),
    [],
  );

  return {
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
  };
}
