import React from "react";
import { CheckCircle } from "lucide-react";

export function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
