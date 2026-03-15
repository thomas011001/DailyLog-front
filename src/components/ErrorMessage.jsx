import React from "react";
import { AlertCircle } from "lucide-react";

export function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
