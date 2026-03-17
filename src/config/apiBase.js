const RAW_API_URL_BASE =
  import.meta.env.API_URL_BASE ??
  import.meta.env.VITE_API_URL_BASE ??
  "http://127.0.0.1:8000";

// Normalize to avoid double slashes when concatenating with endpoints
export const API_URL_BASE = RAW_API_URL_BASE.replace(/\/+$/, "");

