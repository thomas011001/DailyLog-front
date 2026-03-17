import { useState, useCallback } from "react";
import { API_URL_BASE } from "../config/apiBase";

const TOKEN_KEY = "auth_token";

/**
 * Decodes a JWT payload without verifying the signature.
 * Returns null if the token is missing or malformed.
 */
function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * useAuth — base authentication hook
 *
 * Provides:
 *   signup(credentials)  → POST /auth/signup
 *   login(credentials)   → POST /auth/login
 *   logout()             → clears the stored token
 *   me()                 → returns decoded token payload (no network call)
 */
export function useAuth({
  baseUrl = "https://thomasyacoub-daily-log.hf.space",
} = {}) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── helpers ────────────────────────────────────────────────────────────────

  const saveToken = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  async function request(endpoint, body) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
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
   * signup({ email, password, ...rest })
   * Registers a new user and stores the returned token.
   */
  const signup = useCallback(
    async (credentials) => {
      let data = await request("/signup", credentials);
      data = await request("/login", credentials);
      if (data.token) saveToken(data.token);
      return data;
    },
    [saveToken],
  );

  /**
   * login({ email, password })
   * Authenticates an existing user and stores the returned token.
   */
  const login = useCallback(
    async (credentials) => {
      const data = await request("/login", credentials);
      if (data.token) saveToken(data.token);
      return data;
    },
    [saveToken],
  );

  /**
   * logout()
   * Removes the token from state and localStorage.
   */
  const logout = useCallback(() => {
    clearToken();
  }, [clearToken]);

  const user = decodeToken(token);

  // ─── derived state ───────────────────────────────────────────────────────────

  const isAuthenticated = Boolean(token);

  return {
    // state
    token,
    isAuthenticated,
    loading,
    error,
    user,
    // actions
    signup,
    login,
    logout,
  };
}
