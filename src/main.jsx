import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { route } from "./routes";
import "./globals.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route} />
    <Toaster richColors position="bottom-right" />
  </StrictMode>,
);
