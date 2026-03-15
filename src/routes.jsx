import { createBrowserRouter } from "react-router-dom";
import { SignUp } from "./routes/SignUp";
import { Login } from "./routes/Login";
import { Main } from "./routes/Main";
import { DayPage } from "./components/DayPage";

export const route = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Main />,
    children: [
      // حط هنا الـ routes الجديدة مثلاً:
      { path: "day/:id", element: <DayPage /> },
    ],
  },
]);
